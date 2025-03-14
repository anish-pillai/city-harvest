import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { funds } from "@/lib/db/schema"
import { donations } from "@/lib/db/schema"
import { eq, desc, sql, and } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { DonationOptions } from "@/components/donation-options"
import { CreditCard, Gift, Globe, Heart, Home, Users } from "lucide-react"

export const metadata = {
  title: "Giving | City Harvest International Fellowship",
  description:
    "Support the mission and ministries of City Harvest International Fellowship through your generous giving.",
}

async function getFundsWithStats() {
  const fundsData = await db.query.funds.findMany({
    where: eq(funds.active, true),
    orderBy: [desc(funds.createdAt)],
  })

  // Calculate total donations for each fund
  const fundsWithStats = await Promise.all(
    fundsData.map(async (fund) => {
      const totalDonationsResult = await db
        .select({ sum: sql<number>`sum(amount)` })
        .from(donations)
        .where(and(eq(donations.fundId, fund.id), eq(donations.status, "COMPLETED")))

      const totalDonations = totalDonationsResult[0].sum || 0
      const progress = fund.goal ? (totalDonations / fund.goal) * 100 : null

      return {
        ...fund,
        totalDonations,
        progress,
      }
    }),
  )

  return fundsWithStats
}

export default async function GivingPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Giving</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Support the mission and ministries of City Harvest International Fellowship through your generous giving.
        </p>
      </div>

      {/* Donation Options */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Ways to Give</h2>
        <Suspense fallback={<DonationOptionsSkeleton />}>
          <DonationOptionsContent />
        </Suspense>
      </section>

      {/* Rest of the page content remains the same */}
      {/* Why Give Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why We Give</h2>
            <p className="text-lg mb-4">
              At City Harvest, we believe that giving is an act of worship and an expression of our gratitude to God for
              His blessings in our lives.
            </p>
            <p className="text-lg mb-4">Your generous contributions enable us to:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <Heart className="h-5 w-5 text-primary mr-2 shrink-0 mt-1" />
                <span>Support our local and global outreach initiatives</span>
              </li>
              <li className="flex items-start">
                <Home className="h-5 w-5 text-primary mr-2 shrink-0 mt-1" />
                <span>Maintain our facilities as a welcoming place of worship</span>
              </li>
              <li className="flex items-start">
                <Users className="h-5 w-5 text-primary mr-2 shrink-0 mt-1" />
                <span>Develop programs for children, youth, and adults</span>
              </li>
              <li className="flex items-start">
                <Globe className="h-5 w-5 text-primary mr-2 shrink-0 mt-1" />
                <span>Support missionaries and humanitarian efforts worldwide</span>
              </li>
            </ul>
            <p className="text-lg italic">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion,
              for God loves a cheerful giver." - 2 Corinthians 9:7
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=800&width=600" alt="Community Outreach" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Ways to Give */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ways to Give</h2>
          <p className="text-lg max-w-3xl mx-auto">We offer several convenient ways for you to support our ministry.</p>
        </div>

        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="online">Online</TabsTrigger>
            <TabsTrigger value="app">Mobile App</TabsTrigger>
            <TabsTrigger value="person">In Person</TabsTrigger>
            <TabsTrigger value="mail">By Mail</TabsTrigger>
          </TabsList>

          <TabsContent value="online" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Give Online</h3>
                <p className="mb-6">
                  Make a secure online donation using your credit card or bank account. You can set up a one-time gift
                  or recurring donations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-lg p-4 text-center">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="font-medium">Credit/Debit Card</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <svg
                      className="h-8 w-8 mx-auto mb-2 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path d="M12 8V16M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <p className="font-medium">Bank Transfer (ACH)</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <svg
                      className="h-8 w-8 mx-auto mb-2 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                      <path d="M7 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <p className="font-medium">PayPal</p>
                  </div>
                </div>
                <Button size="lg" className="w-full md:w-auto" asChild>
                  <Link href="/giving/donate">Give Now</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="app" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Give Through Our Mobile App</h3>
                <p className="mb-6">
                  Download our church app to make donations, set up recurring giving, and track your giving history.
                </p>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.954 11.616L15.911 8.659L12.954 5.7M19.071 12.072L15.911 8.659M5.93 5.637L9.294 15.71L10.009 17.98"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    App Store
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 21L18.66 14.34C19.11 13.89 19.11 13.11 18.66 12.66L12 6L5.34 12.66C4.89 13.11 4.89 13.89 5.34 14.34L12 21Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Google Play
                  </Button>
                </div>
                <div className="relative h-48 w-full md:w-1/2 mx-auto rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=800"
                    alt="Church Mobile App"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="person" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Give In Person</h3>
                <p className="mb-4">
                  You can give during our worship services by placing your gift in the offering baskets or using our
                  giving kiosks in the lobby.
                </p>
                <p className="mb-6">
                  <span className="font-medium">Service Times:</span>
                  <br />
                  Sunday: 10:00 AM - 12:00 PM
                  <br />
                  Wednesday: 7:00 PM - 8:30 PM
                </p>
                <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/placeholder.svg?height=400&width=800"
                    alt="Church Service"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mail" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Give By Mail</h3>
                <p className="mb-4">You can mail your check or money order to our church office:</p>
                <div className="bg-muted/40 p-4 rounded-lg mb-6">
                  <p className="font-medium">City Harvest International Fellowship</p>
                  <p>123 Church Street</p>
                  <p>City, State 12345</p>
                </div>
                <p className="mb-4">
                  Please make checks payable to "City Harvest International Fellowship" and include any specific
                  designation for your gift in the memo line.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Giving Areas */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Areas to Support</h2>
          <p className="text-lg max-w-3xl mx-auto">
            Your giving can be directed to specific ministries and initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <Gift className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">General Fund</h3>
              <p className="mb-4">
                Supports the overall ministry of the church, including operations, staff, and programs.
              </p>
              <Button variant="outline" className="w-full">
                Give to General Fund
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Missions</h3>
              <p className="mb-4">Supports our local and global mission partners and outreach initiatives.</p>
              <Button variant="outline" className="w-full">
                Give to Missions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Youth Ministry</h3>
              <p className="mb-4">
                Supports programs and activities for children and youth in our church and community.
              </p>
              <Button variant="outline" className="w-full">
                Give to Youth Ministry
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16 bg-muted/40 p-8 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg max-w-3xl mx-auto">Find answers to common questions about giving to City Harvest.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Is my donation tax-deductible?</h3>
            <p className="text-muted-foreground">
              Yes, City Harvest International Fellowship is a registered 501(c)(3) non-profit organization. All
              donations are tax-deductible to the extent allowed by law.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">How do I get a giving statement?</h3>
            <p className="text-muted-foreground">
              Annual giving statements are sent out in January for the previous year. You can also access your giving
              history through our church app or by contacting the church office.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Can I set up recurring donations?</h3>
            <p className="text-muted-foreground">
              Yes, you can set up recurring donations online or through our church app. You can choose the frequency
              (weekly, bi-weekly, monthly) and the amount.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">How is my donation used?</h3>
            <p className="text-muted-foreground">
              Your donations support our church's ministries, operations, outreach programs, and missions. We are
              committed to financial transparency and stewardship.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg max-w-3xl mx-auto mb-8">
          Your generosity enables us to share God's love with our community and beyond. Thank you for your support!
        </p>
        <Button size="lg" asChild>
          <Link href="/giving/donate">Give Now</Link>
        </Button>
      </section>
    </div>
  )
}

async function DonationOptionsContent() {
  const fundsWithStats = await getFundsWithStats()
  return <DonationOptions funds={fundsWithStats} />
}

function DonationOptionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

