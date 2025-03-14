import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id

    // Promote user to admin
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error promoting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

