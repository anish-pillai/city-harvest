import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { donations } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Donation History | City Harvest International Fellowship",
  description: "View your donation history and download receipts.",
}

async function getUserDonations(userId: string) {
  const userDonations = await db.query.donations.findMany({
    where: eq(donations.userId, userId),
    orderBy: [desc(donations.createdAt)],
    with: {
      fund: true,
    },
  })

  return userDonations
}

export default async function DonationHistoryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/account/donations")
  }

  const userDonations = await getUserDonations(session.user.id)

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Your Donation History</h1>
          <p className="text-muted-foreground">View your donation history and download receipts for tax purposes.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>A record of all your donations to City Harvest International Fellowship.</CardDescription>
          </CardHeader>
          <CardContent>
            {userDonations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't made any donations yet.</p>
                <Button asChild>
                  <Link href="/giving/donate">Make a Donation</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fund</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{format(new Date(donation.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: donation.currency,
                        }).format(donation.amount)}
                      </TableCell>
                      <TableCell>{donation.fund?.name || "General Fund"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            donation.status === "COMPLETED"
                              ? "default"
                              : donation.status === "PENDING"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {donation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {donation.status === "COMPLETED" && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Receipt
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

