"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useSession } from "next-auth/react"
// Add import for the personalized suggestions component
import { PersonalizedDonationSuggestions } from "@/components/personalized-donation-suggestions"

// Load Stripe outside of component to avoid recreating Stripe object on renders
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type DonationFormProps = {
  funds: { id: string; name: string }[]
}

export function DonationForm({ funds }: DonationFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <DonationFormContent funds={funds} />
    </Elements>
  )
}

function DonationFormContent({ funds }: DonationFormProps) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card")

  // Form state
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [fundId, setFundId] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [interval, setInterval] = useState<"month" | "year">("month")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "")
      setName(session.user.name || "")
    }
  }, [session])

  const predefinedAmounts = ["25", "50", "100", "250", "500"]

  const handleAmountChange = (value: string) => {
    setAmount(value)
    if (value !== "custom") {
      setCustomAmount("")
    }
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setCustomAmount(value)
  }

  const getDonationAmount = () => {
    if (amount === "custom") {
      return Number.parseFloat(customAmount)
    }
    return Number.parseFloat(amount)
  }

  const validateForm = () => {
    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.")
      return false
    }

    const donationAmount = getDonationAmount()
    if (isNaN(donationAmount) || donationAmount <= 0) {
      setError("Please enter a valid donation amount.")
      return false
    }

    if (!email) {
      setError("Please enter your email address.")
      return false
    }

    if (!isAnonymous && !name) {
      setError("Please enter your name or choose to donate anonymously.")
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      setError(null)

      // Create payment intent on the server
      const donationAmount = getDonationAmount()
      const response = await fetch("/api/donations/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationAmount,
          currency: "usd",
          fundId: fundId || undefined,
          isRecurring,
          interval: isRecurring ? interval : undefined,
          isAnonymous,
          email,
          name: isAnonymous ? undefined : name,
          userId: session?.user?.id, // Add this line to include the user ID
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Something went wrong with your donation.")
      }

      const { clientSecret, paymentIntentId } = await response.json()

      // Confirm card payment
      const cardElement = elements!.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error: stripeError, paymentIntent } = await stripe!.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: isAnonymous ? "Anonymous" : name,
            email,
          },
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed. Please try again.")
      }

      if (paymentIntent.status === "succeeded") {
        setSuccess(true)
        toast({
          title: "Donation Successful",
          description: "Thank you for your generous donation!",
        })

        // Redirect to thank you page after a short delay
        setTimeout(() => {
          router.push(`/giving/thank-you?id=${paymentIntentId}`)
        }, 1500)
      } else {
        throw new Error("Payment was not successful. Please try again.")
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      toast({
        title: "Donation Failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {session?.user && (
        <PersonalizedDonationSuggestions
          onSelectAmount={(amount) => {
            setAmount(amount)
            setCustomAmount("")
          }}
        />
      )}
      {/* Donation Amount Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Donation Amount</h3>
        <RadioGroup value={amount} onValueChange={handleAmountChange} className="grid grid-cols-3 gap-3">
          {predefinedAmounts.map((value) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={`amount-${value}`} />
              <Label htmlFor={`amount-${value}`}>${value}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="amount-custom" />
            <Label htmlFor="amount-custom">Custom</Label>
          </div>
        </RadioGroup>

        {amount === "custom" && (
          <div className="flex items-center">
            <span className="mr-2 text-lg">$</span>
            <Input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount"
              className="max-w-[200px]"
              aria-label="Custom donation amount"
            />
          </div>
        )}
      </div>

      {/* Fund Selection */}
      <div className="space-y-2">
        <Label htmlFor="fund">Donation Fund (Optional)</Label>
        <Select value={fundId} onValueChange={setFundId}>
          <SelectTrigger id="fund">
            <SelectValue placeholder="Select a fund" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Fund</SelectItem>
            {funds.map((fund) => (
              <SelectItem key={fund.id} value={fund.id}>
                {fund.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Recurring Donation */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
          <Label htmlFor="recurring">Make this a recurring donation</Label>
        </div>

        {isRecurring && (
          <div className="pl-6 space-y-2">
            <Label htmlFor="interval">Frequency</Label>
            <Select value={interval} onValueChange={(value: "month" | "year") => setInterval(value)}>
              <SelectTrigger id="interval">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Information</h3>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          <Label htmlFor="anonymous">Make this an anonymous donation</Label>
        </div>

        {!isAnonymous && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required={!isAnonymous} />
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Information</h3>

        <div className="space-y-2">
          <Label htmlFor="payment-method">Payment Method</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value: "card" | "bank") => setPaymentMethod(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="payment-card" />
              <Label htmlFor="payment-card">Credit/Debit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank" id="payment-bank" disabled />
              <Label htmlFor="payment-bank" className="text-muted-foreground">
                Bank Transfer (Coming Soon)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 border rounded-md bg-card">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-4 text-sm border rounded-md bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center p-4 text-sm border rounded-md bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-4 h-4 mr-2" />
          Your donation was successful! Redirecting to thank you page...
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading || success || !stripe || !elements}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Donate ${amount && amount !== "custom" ? `$${amount}` : amount === "custom" && customAmount ? `$${customAmount}` : ""}`
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your payment information is processed securely by Stripe. We do not store your credit card details.
      </p>
    </form>
  )
}

