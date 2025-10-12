import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { addMonths, addWeeks, addYears } from "date-fns";
import { and, eq, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dueSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          lte(subscriptions.renewalDate, new Date().toISOString().split("T")[0])
        )
      );

    if (dueSubscriptions.length === 0) {
      return NextResponse.json({ message: "No subscriptions to update." });
    }

    for (const sub of dueSubscriptions) {
      let newRenewalDate = new Date(sub.renewalDate);
      switch (sub.billingCycle) {
        case "weekly":
          newRenewalDate = addWeeks(newRenewalDate, 1);
          break;
        case "monthly":
          newRenewalDate = addMonths(newRenewalDate, 1);
          break;
        case "quarterly":
          newRenewalDate = addMonths(newRenewalDate, 3);
          break;
        case "yearly":
          newRenewalDate = addYears(newRenewalDate, 1);
          break;
        default:
          continue;
      }

      const newStatus = sub.status === "trial" ? "active" : sub.status;
      await db
        .update(subscriptions)
        .set({
          renewalDate: newRenewalDate.toISOString().split("T")[0],
          status: newStatus,
        })
        .where(eq(subscriptions.id, sub.id));
    }

    return NextResponse.json({
      message: `Successfully updated ${dueSubscriptions.length} subscriptions.`,
    });
  } catch (error) {
    console.error("POST /api/cron error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
