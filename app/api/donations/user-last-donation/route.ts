import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { donations } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Verify the requested userId matches the authenticated user
    if (userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get the user's most recent completed donation
    const lastDonation = await db.query.donations.findFirst({
      where: (donations, { and, eq }) => and(eq(donations.userId, userId), eq(donations.status, "COMPLETED")),
      orderBy: [desc(donations.createdAt)],
    })

    if (!lastDonation) {
      return NextResponse.json({ amount: null })
    }

    return NextResponse.json({ amount: lastDonation.amount })
  } catch (error) {
    console.error("Error fetching last donation:", error)
    return NextResponse.json({ message: "Error fetching donation data" }, { status: 500 })
  }
}

