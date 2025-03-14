import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { funds, donations } from "@/lib/db/schema"
import { eq, asc, and, sql } from "drizzle-orm"
import { insertFundSchema } from "@/lib/db/schema"
import { nanoid } from "nanoid"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("activeOnly") === "true"

    // Build filter conditions
    const whereClause = activeOnly ? eq(funds.active, true) : undefined

    // Fetch all funds
    const fundsData = await db.query.funds.findMany({
      where: whereClause,
      orderBy: [asc(funds.name)],
      with: {
        donations: true,
      },
    })

    // Calculate total donations for each fund
    const fundsWithTotals = await Promise.all(
      fundsData.map(async (fund) => {
        const totalDonationsResult = await db
          .select({ sum: sql<number>`sum(amount)` })
          .from(donations)
          .where(and(eq(donations.fundId, fund.id), eq(donations.status, "COMPLETED")))

        const totalDonations = totalDonationsResult[0].sum || 0

        return {
          ...fund,
          totalDonations,
          progress: fund.goal ? (totalDonations / fund.goal) * 100 : null,
          _count: {
            donations: fund.donations.length,
          },
          donations: undefined, // Remove the donations array from the response
        }
      }),
    )

    return NextResponse.json(fundsWithTotals)
  } catch (error) {
    console.error("Error fetching funds:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate data
    const validatedData = insertFundSchema.parse({
      ...data,
      goal: data.goal ? Number.parseFloat(data.goal) : null,
    })

    // Create new fund
    const fund = await db
      .insert(funds)
      .values({
        id: nanoid(),
        ...validatedData,
      })
      .returning()

    return NextResponse.json(fund[0], { status: 201 })
  } catch (error) {
    console.error("Error creating fund:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

