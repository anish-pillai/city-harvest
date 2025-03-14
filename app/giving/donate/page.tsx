import { Suspense } from "react"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import { funds } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { DonationForm } from "@/components/donation-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Add imports for authentication components
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { SignInButton } from "@/components/auth/sign-in-button"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Donate | City Harvest International Fellowship",
  description:
    "Support the mission and ministries of City Harvest International Fellowship through your generous giving.",
}

async function getFunds() {
  const activeFunds = await db.query.funds.findMany({
    where: eq(funds.active, true),
    orderBy: (funds, { asc }) => [asc(funds.name)],
  })

  return activeFunds
}

// Update the page component to check for session
export default async function DonatePage() {
  const session = await getServerSession(authOptions)
  const fundsData = await getFunds()

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
          <p className="text-xl text-muted-foreground">
            Your generosity helps us continue our mission and serve our community.
          </p>
        </div>

        {!session ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sign In to Track Your Donations</CardTitle>
              <CardDescription>
                Sign in to track your donation history and receive tax receipts automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <p className="text-center text-muted-foreground">
                  Signing in is optional. You can still donate as a guest.
                </p>
                <SignInButton />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-5 w-5 text-primary" />
                <p>Signed in as {session.user?.name || session.user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account/donations">View Donation History</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Donation Details</CardTitle>
            <CardDescription>
              Fill out the form below to make a secure donation. All transactions are processed by Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<DonationFormSkeleton />}>
              <DonationForm funds={fundsData} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DonationFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-3 gap-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
        </div>
      </div>

      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />

      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-20 w-full" />
      </div>

      <Skeleton className="h-12 w-full" />
    </div>
  )
}

