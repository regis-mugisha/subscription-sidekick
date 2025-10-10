import { db } from "@/db/drizzle";
import { subscription } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const id = params.id;
    const body = await req.json();
    const allowed: Record<string, unknown> = {};

    if (typeof body.service === "string") allowed.service = body.service;
    if (typeof body.plan === "string" || body.plan === null) allowed.plan = body.plan;
    if (typeof body.status === "string" || body.status === null)
      allowed.status = body.status;
    if (typeof body.billingCycle === "string" || body.billingCycle === null)
      allowed.billingCycle = body.billingCycle;
    if (typeof body.amount === "number") allowed.amount = body.amount;
    if (typeof body.renewalDate === "string") allowed.renewalDate = body.renewalDate;

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    const updated = await db
      .update(subscription)
      .set(allowed)
      .where(and(eq(subscription.id, id), eq(subscription.userId, userId)))
      .returning();

    if (!updated.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ subscription: updated[0] });
  } catch (err) {
    console.error("PATCH /api/subscriptions/[id] error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const id = params.id;

    const deleted = await db
      .delete(subscription)
      .where(and(eq(subscription.id, id), eq(subscription.userId, userId)))
      .returning();

    if (!deleted.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/subscriptions/[id] error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


