import NextAuth, { type AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import { DrizzleAdapter } from "@/lib/auth/drizzle-adapter"

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      // Add role to session
      if (session.user) {
        session.user.role = user.role
        session.user.id = user.id
      }
      return session
    },
    async jwt({ token, user }) {
      // Add role to token
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after login if coming from admin pages
      if (url.startsWith("/login") && url.includes("callbackUrl=/admin")) {
        return `${baseUrl}/admin`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

