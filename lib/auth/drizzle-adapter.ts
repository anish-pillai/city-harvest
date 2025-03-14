import { and, eq } from "drizzle-orm"
import type { Adapter } from "next-auth/adapters"
import { db } from "@/lib/db"
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema"
import { nanoid } from "nanoid"

export function DrizzleAdapter(): Adapter {
  return {
    async createUser(userData) {
      const id = nanoid()
      await db.insert(users).values({
        id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        image: userData.image,
      })

      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      })

      return user!
    },

    async getUser(id) {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      })

      return user || null
    },

    async getUserByEmail(email) {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      return user || null
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db.query.accounts.findFirst({
        where: and(eq(accounts.providerAccountId, providerAccountId), eq(accounts.provider, provider)),
        with: {
          user: true,
        },
      })

      return result?.user || null
    },

    async updateUser(user) {
      await db
        .update(users)
        .set({
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        })
        .where(eq(users.id, user.id))

      const updatedUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      })

      return updatedUser!
    },

    async deleteUser(userId) {
      await db.delete(users).where(eq(users.id, userId))
    },

    async linkAccount(account) {
      await db.insert(accounts).values({
        id: nanoid(),
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refreshToken: account.refresh_token,
        accessToken: account.access_token,
        expiresAt: account.expires_at,
        tokenType: account.token_type,
        scope: account.scope,
        idToken: account.id_token,
        sessionState: account.session_state,
      })
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .delete(accounts)
        .where(and(eq(accounts.providerAccountId, providerAccountId), eq(accounts.provider, provider)))
    },

    async createSession(data) {
      await db.insert(sessions).values({
        id: nanoid(),
        userId: data.userId,
        sessionToken: data.sessionToken,
        expires: data.expires,
      })

      const session = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, data.sessionToken),
      })

      return session!
    },

    async getSessionAndUser(sessionToken) {
      const result = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, sessionToken),
        with: {
          user: true,
        },
      })

      if (!result) return null

      const { user, ...session } = result

      return {
        session,
        user,
      }
    },

    async updateSession(session) {
      await db
        .update(sessions)
        .set({
          expires: session.expires,
        })
        .where(eq(sessions.sessionToken, session.sessionToken))

      const updatedSession = await db.query.sessions.findFirst({
        where: eq(sessions.sessionToken, session.sessionToken),
      })

      return updatedSession!
    },

    async deleteSession(sessionToken) {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
    },

    async createVerificationToken(verificationToken) {
      await db.insert(verificationTokens).values({
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      })

      const token = await db.query.verificationTokens.findFirst({
        where: and(
          eq(verificationTokens.identifier, verificationToken.identifier),
          eq(verificationTokens.token, verificationToken.token),
        ),
      })

      return token!
    },

    async useVerificationToken({ identifier, token }) {
      const verificationToken = await db.query.verificationTokens.findFirst({
        where: and(eq(verificationTokens.identifier, identifier), eq(verificationTokens.token, token)),
      })

      if (!verificationToken) return null

      await db
        .delete(verificationTokens)
        .where(and(eq(verificationTokens.identifier, identifier), eq(verificationTokens.token, token)))

      return verificationToken
    },
  }
}

