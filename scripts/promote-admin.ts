// This script is meant to be run from the command line to promote a user to admin
// Usage: npx tsx scripts/promote-admin.ts user@example.com

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error("Please provide an email address")
    process.exit(1)
  }

  try {
    const [user] = await db.update(users).set({ role: "ADMIN" }).where(eq(users.email, email)).returning()

    if (!user) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }

    console.log(`User ${user.email} has been promoted to ADMIN role`)
  } catch (error) {
    console.error("Error promoting user:", error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })

