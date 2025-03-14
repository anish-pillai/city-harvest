import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

// For migrations
const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 })

async function main() {
  console.log("Running migrations...")

  const db = drizzle(migrationClient)

  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migrations completed successfully!")

  await migrationClient.end()
  process.exit(0)
}

main().catch((err) => {
  console.error("Migration failed:")
  console.error(err)
  process.exit(1)
})

