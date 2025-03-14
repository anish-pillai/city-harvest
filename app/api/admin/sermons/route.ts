import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { sermons } from "@/lib/db/schema"
import { eq, desc, like, or, and, sql } from "drizzle-orm"
import { createSermonSchema } from "@/lib/db/schema"
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
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || undefined

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build filter conditions
    let whereClause = undefined

    if (search) {
      whereClause = or(
        like(sermons.title, `%${search}%`),
        like(sermons.speaker, `%${search}%`),
        like(sermons.description, `%${search}%`),
      )
    }

    if (category && category !== "all") {
      const categoryFilter = eq(sermons.category, category)
      whereClause = whereClause ? and(whereClause, categoryFilter) : categoryFilter
    }

    // Fetch sermons with pagination
    const sermonsData = await db.query.sermons.findMany({
      where: whereClause,
      orderBy: [desc(sermons.date)],
      limit,
      offset: skip,
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Count total sermons
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sermons)
      .where(whereClause || sql`1=1`)

    const total = countResult[0].count

    return NextResponse.json({
      sermons: sermonsData,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching sermons:", error)
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
    const validatedData = createSermonSchema.parse({
      ...data,
      authorId: session.user.id,
    })

    // Create new sermon
    const sermon = await db
      .insert(sermons)
      .values({
        id: nanoid(),
        ...validatedData,
        date: new Date(data.date),
      })
      .returning()

    return NextResponse.json(sermon[0], { status: 201 })
  } catch (error) {
    console.error("Error creating sermon:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

