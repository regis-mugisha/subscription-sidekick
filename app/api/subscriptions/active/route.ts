import { db } from "@/db/drizzle";
import { subscription } from "@/db/schema";
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
      .from(subscription)
      .where(
        and(eq(subscription.userId, userId), eq(subscription.status, "active"))
      );

    return NextResponse.json({ subscriptions: activeSubscriptions });
  } catch (error) {
    console.error("Failed to retrieve active subscriptions:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
