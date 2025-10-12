CREATE TYPE "public"."billing_cycles" AS ENUM('weekly', 'monthly', 'quarterly', 'yearly', 'custom');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'trial', 'paused', 'canceled');--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"service" varchar NOT NULL,
	"plan" varchar NOT NULL,
	"amount_usd" integer NOT NULL,
	"billing_cycle" "billing_cycles" DEFAULT 'monthly',
	"status" "status" DEFAULT 'active',
	"next_renewal" date NOT NULL
);
