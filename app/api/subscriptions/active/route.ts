import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, "active")
        )
      );

    return NextResponse.json({ subscriptions: activeSubscriptions });
  } catch (error) {
    console.error("Failed to retrieve active subscriptions:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
