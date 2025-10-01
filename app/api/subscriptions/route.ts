import { db } from "@/db/drizzle";
import { subscription } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
      .insert(subscription)
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
