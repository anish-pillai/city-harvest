import { pgTable, text, timestamp, boolean, integer, doublePrecision, varchar, foreignKey } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

// User-related tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: text("role").default("USER").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      providerProviderAccountIdKey: foreignKey({
        columns: [table.provider, table.providerAccountId],
        name: "provider_provider_account_id_key",
      })
        .references(() => [accounts.provider, accounts.providerAccountId])
        .onDelete("cascade"),
    }
  },
)

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").unique().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      identifierTokenKey: foreignKey({
        columns: [table.identifier, table.token],
        name: "identifier_token_key",
      })
        .references(() => [verificationTokens.identifier, verificationTokens.token])
        .onDelete("cascade"),
    }
  },
)

// Sermon-related tables
export const sermons = pgTable("sermons", {
  id: text("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  speaker: text("speaker").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  audioUrl: text("audio_url"),
  category: text("category"),
  tags: text("tags").array(),
  featured: boolean("featured").default(false).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
})

// Event-related tables
export const events = pgTable("events", {
  id: text("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }),
  time: text("time"),
  location: text("location"),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category"),
  featured: boolean("featured").default(false).notNull(),
  registrationRequired: boolean("registration_required").default(false).notNull(),
  registrationUrl: text("registration_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
})

export const eventAttendees = pgTable("event_attendees", {
  id: text("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
})

// Donation-related tables
export const funds = pgTable("funds", {
  id: text("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  goal: doublePrecision("goal"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
})

export const donations = pgTable("donations", {
  id: text("id").primaryKey().defaultRandom(),
  amount: doublePrecision("amount").notNull(),
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: text("status").default("COMPLETED").notNull(),
  paymentMethod: text("payment_method"),
  paymentId: text("payment_id"),
  description: text("description"),
  anonymous: boolean("anonymous").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  userId: text("user_id").references(() => users.id),
  fundId: text("fund_id").references(() => funds.id),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  sermons: many(sermons),
  events: many(events),
  donations: many(donations),
}))

export const sermonsRelations = relations(sermons, ({ one }) => ({
  author: one(users, {
    fields: [sermons.authorId],
    references: [users.id],
  }),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  author: one(users, {
    fields: [events.authorId],
    references: [users.id],
  }),
  attendees: many(eventAttendees),
}))

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
}))

export const donationsRelations = relations(donations, ({ one }) => ({
  user: one(users, {
    fields: [donations.userId],
    references: [users.id],
  }),
  fund: one(funds, {
    fields: [donations.fundId],
    references: [funds.id],
  }),
}))

export const fundsRelations = relations(funds, ({ many }) => ({
  donations: many(donations),
}))

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export const insertSermonSchema = createInsertSchema(sermons)
export const selectSermonSchema = createSelectSchema(sermons)

export const insertEventSchema = createInsertSchema(events)
export const selectEventSchema = createSelectSchema(events)

export const insertEventAttendeeSchema = createInsertSchema(eventAttendees)
export const selectEventAttendeeSchema = createSelectSchema(eventAttendees)

export const insertFundSchema = createInsertSchema(funds)
export const selectFundSchema = createSelectSchema(funds)

export const insertDonationSchema = createInsertSchema(donations)
export const selectDonationSchema = createSelectSchema(donations)

// Custom Zod schemas with additional validation
export const createSermonSchema = insertSermonSchema.extend({
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [],
    ),
})

export const createEventSchema = insertEventSchema.extend({
  date: z.string().transform((val) => new Date(val)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
})

export const createDonationSchema = insertDonationSchema.extend({
  amount: z.number().positive(),
})

