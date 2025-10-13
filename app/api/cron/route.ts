import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { addMonths, addWeeks, addYears } from "date-fns";
import { and, eq, lte, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const today = new Date();

    const dueSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          lte(subscriptions.renewalDate, today.toISOString().split("T")[0]),
          or(
            eq(subscriptions.status, "active"),
            eq(subscriptions.status, "trial")
          )
        )
      );

    if (dueSubscriptions.length === 0) {
      return NextResponse.json({ message: "No subscriptions to update." });
    }

    for (const sub of dueSubscriptions) {
      let newRenewalDate = new Date(sub.renewalDate);
      while (newRenewalDate <= today) {
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
            // Break the loop for 'custom' or unknown cycles
            newRenewalDate = new Date("9999-12-31"); // A fail-safe to exit the loop
            continue;
        }
      }

      if (newRenewalDate.getFullYear() === 9999) continue;

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
