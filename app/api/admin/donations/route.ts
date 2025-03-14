import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { donations } from "@/lib/db/schema"
import { eq, desc, and, sql, gte, lte } from "drizzle-orm"
import { createDonationSchema } from "@/lib/db/schema"
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
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || undefined
    const fundId = searchParams.get("fundId") || undefined
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build filter conditions
    let whereClause = undefined

    if (status) {
      whereClause = eq(donations.status, status)
    }

    if (fundId) {
      const fundFilter = eq(donations.fundId, fundId)
      whereClause = whereClause ? and(whereClause, fundFilter) : fundFilter
    }

    if (startDate) {
      const startDateFilter = gte(donations.createdAt, new Date(startDate))
      whereClause = whereClause ? and(whereClause, startDateFilter) : startDateFilter
    }

    if (endDate) {
      const endDateFilter = lte(donations.createdAt, new Date(endDate))
      whereClause = whereClause ? and(whereClause, endDateFilter) : endDateFilter
    }

    // Fetch donations with pagination
    const donationsData = await db.query.donations.findMany({
      where: whereClause,
      orderBy: [desc(donations.createdAt)],
      limit,
      offset: skip,
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        fund: true,
      },
    })

    // Count total donations
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(donations)
      .where(whereClause || sql`1=1`)

    const total = countResult[0].count

    // Calculate total amount for completed donations
    const totalAmountResult = await db
      .select({ sum: sql<number>`sum(amount)` })
      .from(donations)
      .where(and(whereClause || sql`1=1`, eq(donations.status, "COMPLETED")))

    const totalAmount = totalAmountResult[0].sum || 0

    return NextResponse.json({
      donations: donationsData,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
      stats: {
        totalAmount,
      },
    })
  } catch (error) {
    console.error("Error fetching donations:", error)
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
    const validatedData = createDonationSchema.parse({
      ...data,
      amount: Number.parseFloat(data.amount),
    })

    // Create new donation
    const donation = await db
      .insert(donations)
      .values({
        id: nanoid(),
        ...validatedData,
      })
      .returning()

    return NextResponse.json(donation[0], { status: 201 })
  } catch (error) {
    console.error("Error creating donation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

