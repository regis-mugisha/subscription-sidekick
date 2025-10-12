import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const rawParams = context.params as
      | { id: string }
      | Promise<{ id: string }>;
    const isPromise = (v: unknown): v is Promise<{ id: string }> =>
      !!v && typeof (v as Record<string, unknown>)?.then === "function";
    const resolvedParams = isPromise(rawParams)
      ? await rawParams
      : (rawParams as { id: string });
    const id = resolvedParams.id;
    const body = await req.json();
    const allowed: Record<string, unknown> = {};

    if (typeof body.service === "string") allowed.service = body.service;
    if (typeof body.plan === "string" || body.plan === null)
      allowed.plan = body.plan;
    if (typeof body.status === "string" || body.status === null)
      allowed.status = body.status;
    if (typeof body.billingCycle === "string" || body.billingCycle === null)
      allowed.billingCycle = body.billingCycle;
    if (typeof body.amount === "number") allowed.amount = body.amount;
    if (typeof body.renewalDate === "string")
      allowed.renewalDate = body.renewalDate;

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    const updated = await db
      .update(subscriptions)
      .set(allowed)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .returning();

    if (!updated.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ subscriptions: updated[0] });
  } catch (err) {
    console.error("PATCH /api/subscriptions/[id] error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const rawParams = context.params as
      | { id: string }
      | Promise<{ id: string }>;
    const isPromise2 = (v: unknown): v is Promise<{ id: string }> =>
      !!v && typeof (v as Record<string, unknown>)?.then === "function";
    const resolvedParams = isPromise2(rawParams)
      ? await rawParams
      : (rawParams as { id: string });
    const id = resolvedParams.id;

    const deleted = await db
      .delete(subscriptions)
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .returning();

    if (!deleted.length)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/subscriptions/[id] error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
