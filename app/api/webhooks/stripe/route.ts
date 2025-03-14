import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { donations } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Stripe from "stripe"
// Add import for the email function
import { sendDonationReceipt } from "@/lib/email"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature") as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      return NextResponse.json({ message: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ message: "Error handling webhook" }, { status: 500 })
  }
}

// In the handlePaymentIntentSucceeded function, add:
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { donationId, email, name } = paymentIntent.metadata

  if (donationId) {
    // Update donation status
    await db
      .update(donations)
      .set({
        status: "COMPLETED",
        paymentId: paymentIntent.id,
      })
      .where(eq(donations.id, donationId))

    // Get the updated donation
    const donation = await db.query.donations.findFirst({
      where: eq(donations.id, donationId),
      with: {
        fund: true,
      },
    })

    // Send receipt email if donation exists
    if (donation && email) {
      await sendDonationReceipt(
        {
          ...donation,
          fundName: donation.fund?.name || "General Fund",
        },
        email,
        name,
      )
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { donationId } = paymentIntent.metadata

  if (donationId) {
    await db
      .update(donations)
      .set({
        status: "FAILED",
        paymentId: paymentIntent.id,
      })
      .where(eq(donations.id, donationId))
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const { donationId } = subscription.metadata

  if (donationId) {
    await db
      .update(donations)
      .set({
        status: "COMPLETED",
        paymentId: invoice.payment_intent as string,
      })
      .where(eq(donations.id, donationId))
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const { donationId } = subscription.metadata

  if (donationId) {
    await db
      .update(donations)
      .set({
        status: "FAILED",
        paymentId: invoice.payment_intent as string,
      })
      .where(eq(donations.id, donationId))
  }
}

