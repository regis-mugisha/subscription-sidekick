import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch subscriptions for the current user
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    return NextResponse.json({ subscriptions: userSubscriptions });
  } catch (error) {
    console.error("GET /api/subscriptions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { service, plan, amount, billingCycle, status, renewalDate } =
      body ?? {};

    if (!service || !plan || !amount || !renewalDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const insertResult = await db
      .insert(subscriptions)
      .values({
        userId,
        service,
        plan,
        amount,
        billingCycle,
        status,
        renewalDate,
      })
      .returning();

    return NextResponse.json(
      { subscription: insertResult[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/subscriptions error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
