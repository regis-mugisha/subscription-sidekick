import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch total monthly amount for the current user
    const monthlyTotal = sql<number>`
    CASE
      WHEN ${subscriptions.billingCycle} = 'monthly' THEN (${subscriptions.amount})
        WHEN ${subscriptions.billingCycle} = 'weekly' THEN ((${subscriptions.amount} * 52) / 12)
        WHEN ${subscriptions.billingCycle} = 'quarterly' THEN (${subscriptions.amount} / 3)
        WHEN ${subscriptions.billingCycle} = 'yearly' THEN (${subscriptions.amount} / 12)
        ELSE 0
    END
`;

    const result = await db
      .select({
        monthlyExpenditure: sql<string>`sum(${monthlyTotal})`.as(
          "monthlyExpenditure"
        ),
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));

    const monthlySpend = parseFloat(result[0]?.monthlyExpenditure || "0");

    return NextResponse.json({ monthlyExpenditure: monthlySpend });
  } catch (error) {
    console.error("Failed to retrieve monthly expenditure:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
