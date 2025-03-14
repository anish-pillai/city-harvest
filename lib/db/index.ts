import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// For server-side usage only
const connectionString = process.env.DATABASE_URL!

// Connection for migrations and queries
const client = postgres(connectionString)
export const db = drizzle(client, { schema })

// Helper function to get a new connection for transactions
export const getDb = () => {
  const client = postgres(connectionString)
  return drizzle(client, { schema })
}

