import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if this is an admin route
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      // Redirect to login if not authenticated
      const url = new URL("/login", req.url)
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Check if user has admin role
    if (session.role !== "ADMIN") {
      // Redirect to login with access denied error
      const url = new URL("/login", req.url)
      url.searchParams.set("error", "AccessDenied")
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

