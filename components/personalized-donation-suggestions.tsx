"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type PersonalizedSuggestionsProps = {
  onSelectAmount: (amount: string) => void
}

export function PersonalizedDonationSuggestions({ onSelectAmount }: PersonalizedSuggestionsProps) {
  const { data: session } = useSession()
  const [previousDonation, setPreviousDonation] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch the user's most recent donation amount
      fetch(`/api/donations/user-last-donation?userId=${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.amount) {
            setPreviousDonation(data.amount)
          }
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [session])

  if (loading || !previousDonation) return null

  return (
    <Card className="bg-primary/5 border-primary/20 mb-6">
      <CardContent className="p-4">
        <p className="mb-2">Based on your previous giving:</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onSelectAmount(previousDonation.toString())}>
            ${previousDonation}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSelectAmount((previousDonation * 1.5).toFixed(0))}>
            ${(previousDonation * 1.5).toFixed(0)}
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSelectAmount((previousDonation * 2).toFixed(0))}>
            ${(previousDonation * 2).toFixed(0)}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

