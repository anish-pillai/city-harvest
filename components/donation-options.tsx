import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Gift, Calendar } from "lucide-react"

type Fund = {
  id: string
  name: string
  description: string | null
  goal: number | null
  totalDonations: number
  progress: number | null
}

type DonationOptionsProps = {
  funds: Fund[]
}

export function DonationOptions({ funds }: DonationOptionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>One-Time Gift</CardTitle>
          <CardDescription>Make a single donation to support our church and ministries.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Your one-time gift helps us meet immediate needs and fund ongoing projects.
          </p>
          <ul className="text-sm space-y-2 mb-4">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Support our general operations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Fund special projects and initiatives</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contribute to specific ministries</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/giving/donate?type=one-time">Give Now</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Recurring Giving</CardTitle>
          <CardDescription>Set up automatic recurring donations on a schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Recurring gifts provide consistent support and help us plan for the future.
          </p>
          <ul className="text-sm space-y-2 mb-4">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Monthly or annual giving options</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Easy to manage and update</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Automatic payment processing</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/giving/donate?type=recurring">Give Monthly</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Special Funds</CardTitle>
          <CardDescription>Contribute to specific funds and initiatives.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Support specific ministries and projects that align with your passion.
          </p>
          <div className="space-y-3">
            {funds.slice(0, 3).map((fund) => (
              <div key={fund.id} className="text-sm">
                <div className="font-medium">{fund.name}</div>
                {fund.goal && (
                  <div className="mt-1">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(fund.progress || 0, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>${fund.totalDonations.toLocaleString()} raised</span>
                      <span>Goal: ${fund.goal.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/giving/donate?type=fund">View All Funds</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

