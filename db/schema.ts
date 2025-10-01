import {
  date,
  numeric,
  pgEnum,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const billingCycleEnum = pgEnum("billing_cycles", [
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
  "custom",
]);

export const statusEnum = pgEnum("status", [
  "active",
  "trial",
  "paused",
  "canceled",
]);

export const subscription = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id").notNull(), //clerk user id
  service: varchar("service").notNull(),
  plan: varchar("plan").notNull(),
  amount: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
  billingCycle: billingCycleEnum("billing_cycle").default("monthly"),
  status: statusEnum("status").default("active"),
  renewalDate: date("next_renewal").notNull(),
});
