import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { donations } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Download } from "lucide-react"
import { format } from "date-fns"

export const metadata = {
  title: "Thank You for Your Donation | City Harvest International Fellowship",
  description: "Thank you for your generous donation to City Harvest International Fellowship.",
}

async function getDonationDetails(id: string) {
  if (!id) return null

  const donation = await db.query.donations.findFirst({
    where: eq(donations.id, id),
    with: {
      fund: true,
    },
  })

  return donation
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const donationId = searchParams.id

  if (!donationId) {
    return notFound()
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<ThankYouSkeleton />}>
          <ThankYouContent donationId={donationId} />
        </Suspense>
      </div>
    </div>
  )
}

async function ThankYouContent({ donationId }: { donationId: string }) {
  const donation = await getDonationDetails(donationId)

  if (!donation) {
    return notFound()
  }

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: donation.currency,
  }).format(donation.amount)

  const donationDate = format(new Date(donation.createdAt), "MMMM d, yyyy")

  return (
    <Card className="border-green-200">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-700">Thank You for Your Donation!</CardTitle>
        <CardDescription>Your generosity helps us continue our mission and serve our community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Donation Amount</p>
              <p className="text-lg font-semibold">{formattedAmount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="text-lg font-semibold">{donationDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fund</p>
              <p className="text-lg font-semibold">{donation.fund?.name || "General Fund"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reference ID</p>
              <p className="text-lg font-semibold">{donationId.substring(0, 8)}</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p>A receipt has been sent to your email address. You can also download a copy of your receipt below.</p>
          <Button variant="outline" className="mt-2">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            If you have any questions about your donation, please contact us at{" "}
            <a href="mailto:giving@cityharvest.org" className="text-primary hover:underline">
              giving@cityharvest.org
            </a>
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/giving">Return to Giving</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function ThankYouSkeleton() {
  return (
    <Card>
      <CardHeader className="text-center">
        <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-full mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-md">
          <div className="grid grid-cols-2 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
          </div>
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-full mx-auto" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-10 w-40 mx-auto mt-2" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Skeleton className="h-4 w-full mx-auto" />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardFooter>
    </Card>
  )
}

