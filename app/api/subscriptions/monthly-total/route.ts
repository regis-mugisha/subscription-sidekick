import { db } from "@/db/drizzle";
import { subscription } from "@/db/schema";
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
        WHEN ${subscription.billingCycle} = 'weekly' THEN (${subscription.amount} * 4)
        WHEN ${subscription.billingCycle} = 'quarterly' THEN (${subscription.amount} / 3)
        WHEN ${subscription.billingCycle} = 'yearly' THEN (${subscription.amount} / 12)
        ELSE ${subscription.amount}
    END
`;

    const result = await db
      .select({
        monthlyExpenditure: sql<string>`sum(${monthlyTotal})`.as(
          "monthlyExpenditure"
        ),
      })
      .from(subscription)
      .where(eq(subscription.userId, userId));

    const monthlySpend = parseFloat(result[0]?.monthlyExpenditure || "0");

    return NextResponse.json({ monthlyExpenditure: monthlySpend });
  } catch (error) {
    console.error("Failed to retrieve monthly expenditure:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
