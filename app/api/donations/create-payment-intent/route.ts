import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { donations } from "@/lib/db/schema"
import { nanoid } from "nanoid"
import Stripe from "stripe"

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Get request data
    const {
      amount,
      currency = "usd",
      fundId,
      isRecurring = false,
      interval = "month",
      isAnonymous = false,
      email,
      name,
    } = await request.json()

    // Validate amount
    const donationAmount = Number.parseFloat(amount)
    if (isNaN(donationAmount) || donationAmount <= 0) {
      return NextResponse.json({ message: "Invalid donation amount" }, { status: 400 })
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(donationAmount * 100)

    // Create a donation ID
    const donationId = nanoid()

    if (isRecurring) {
      // For recurring donations, create a subscription

      // First, create or get customer
      let customer
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        customer = await stripe.customers.create({
          email,
          name: isAnonymous ? "Anonymous Donor" : name,
          metadata: {
            donationId,
            fundId: fundId || "general",
            isAnonymous: isAnonymous.toString(),
          },
        })
      }

      // Create a subscription price (or use existing one)
      const priceId = await getOrCreatePrice(donationAmount, currency, interval)

      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          donationId,
          fundId: fundId || "general",
          isAnonymous: isAnonymous.toString(),
        },
      })

      // Get the client secret from the subscription
      const invoice = subscription.latest_invoice as Stripe.Invoice
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

      // Create a donation record in the database
      await db.insert(donations).values({
        id: donationId,
        amount: donationAmount,
        currency,
        status: "PENDING",
        paymentMethod: "card",
        paymentId: paymentIntent.id,
        description: `Recurring ${interval}ly donation`,
        anonymous: isAnonymous,
        userId: session?.user?.id,
        fundId: fundId || null,
      })

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: donationId,
      })
    } else {
      // For one-time donations, create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        payment_method_types: ["card"],
        metadata: {
          donationId,
          fundId: fundId || "general",
          isAnonymous: isAnonymous.toString(),
          email,
          name: isAnonymous ? "Anonymous" : name,
        },
      })

      // Create a donation record in the database
      await db.insert(donations).values({
        id: donationId,
        amount: donationAmount,
        currency,
        status: "PENDING",
        paymentMethod: "card",
        paymentId: paymentIntent.id,
        description: "One-time donation",
        anonymous: isAnonymous,
        userId: session?.user?.id,
        fundId: fundId || null,
      })

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: donationId,
      })
    }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ message: "Error creating payment intent" }, { status: 500 })
  }
}

// Helper function to get or create a price for recurring donations
async function getOrCreatePrice(amount: number, currency: string, interval: string) {
  const amountInCents = Math.round(amount * 100)
  const priceId = `donation-${amountInCents}-${currency}-${interval}`

  try {
    // Try to retrieve the price first
    const price = await stripe.prices.retrieve(priceId)
    return price.id
  } catch (error) {
    // If the price doesn't exist, create it
    const price = await stripe.prices.create({
      id: priceId,
      unit_amount: amountInCents,
      currency,
      recurring: { interval: interval as Stripe.PriceRecurringInterval },
      product_data: {
        name: `${amount} ${currency.toUpperCase()} ${interval}ly donation`,
      },
    })
    return price.id
  }
}

