import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { eq, desc, like, or, and, sql, gte } from "drizzle-orm"
import { createEventSchema } from "@/lib/db/schema"
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
    const upcoming = searchParams.get("upcoming") === "true"

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build filter conditions
    let whereClause = undefined

    if (search) {
      whereClause = or(
        like(events.title, `%${search}%`),
        like(events.location, `%${search}%`),
        like(events.description, `%${search}%`),
      )
    }

    if (category && category !== "all") {
      const categoryFilter = eq(events.category, category)
      whereClause = whereClause ? and(whereClause, categoryFilter) : categoryFilter
    }

    if (upcoming) {
      const upcomingFilter = gte(events.date, new Date())
      whereClause = whereClause ? and(whereClause, upcomingFilter) : upcomingFilter
    }

    // Fetch events with pagination
    const eventsData = await db.query.events.findMany({
      where: whereClause,
      orderBy: [desc(events.date)],
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
        attendees: true,
      },
    })

    // Format the response to include attendee count
    const formattedEvents = eventsData.map((event) => ({
      ...event,
      _count: {
        attendees: event.attendees.length,
      },
      attendees: undefined, // Remove the attendees array from the response
    }))

    // Count total events
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .where(whereClause || sql`1=1`)

    const total = countResult[0].count

    return NextResponse.json({
      events: formattedEvents,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
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
    const validatedData = createEventSchema.parse({
      ...data,
      authorId: session.user.id,
    })

    // Create new event
    const event = await db
      .insert(events)
      .values({
        id: nanoid(),
        ...validatedData,
      })
      .returning()

    return NextResponse.json(event[0], { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

