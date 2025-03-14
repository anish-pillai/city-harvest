import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Receipt, Heart, Settings, LogOut } from "lucide-react"

export const metadata = {
  title: "Account | City Harvest International Fellowship",
  description: "Manage your account and view your donation history.",
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/account")
  }

  const { user } = session
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase()

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Account</h1>
          <p className="text-muted-foreground">Manage your account and view your donation history.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
              <CardDescription>View your donation history and download receipts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Receipt className="h-12 w-12 text-primary mb-4" />
              <p>Access your complete donation history and tax receipts.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/account/donations">View Donations</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recurring Giving</CardTitle>
              <CardDescription>Manage your recurring donations.</CardDescription>
            </CardHeader>
            <CardContent>
              <Heart className="h-12 w-12 text-primary mb-4" />
              <p>Update, pause, or cancel your recurring donations.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/account/recurring">Manage Recurring</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your profile and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Settings className="h-12 w-12 text-primary mb-4" />
              <p>Manage your account settings and notification preferences.</p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/account/settings">Settings</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/api/auth/signout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

