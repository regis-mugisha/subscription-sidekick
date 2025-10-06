"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useEffect, useMemo } from "react";

export default function AnalyticsPage() {
	const { subscriptions, loading, fetchSubscriptions } = useSubscriptionStore();
	const isFetching = loading === "fetching";

	useEffect(() => {
		fetchSubscriptions();
	}, [fetchSubscriptions]);

	// Status breakdown for PieChart
	const statusData = useMemo(() => {
		const counts: Record<string, number> = {};
		subscriptions.forEach((s) => {
			const key = (s.status || "unknown").toLowerCase();
			counts[key] = (counts[key] || 0) + 1;
		});
		return Object.entries(counts).map(([name, value]) => ({ name, value }));
	}, [subscriptions]);

	// Spend by billing cycle for BarChart
	const billingSpendData = useMemo(() => {
		const sums: Record<string, number> = {};
		subscriptions.forEach((s) => {
			const cycle = (s.billingCycle || "unknown").toLowerCase();
			const amount = typeof s.amount === "number" ? s.amount : Number(s.amount ?? 0) || 0;
			sums[cycle] = (sums[cycle] || 0) + amount;
		});
		return Object.entries(sums).map(([cycle, total]) => ({ cycle, total }));
	}, [subscriptions]);

	return (
		<div className="space-y-6 pt-4 md:pt-6">
			{/* Page title */}
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
				<p className="text-sm text-muted-foreground">Overview of subscription status and spend</p>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Status Breakdown</CardTitle>
					</CardHeader>
					<CardContent className="h-[340px]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Tooltip />
								<Legend />
								<Pie
									data={statusData}
									dataKey="value"
									nameKey="name"
									outerRadius={110}
									fill="#8884d8"
									isAnimationActive={!isFetching}
								/>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Spend by Billing Cycle</CardTitle>
					</CardHeader>
					<CardContent className="h-[340px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={billingSpendData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="cycle" tick={{ fontSize: 12 }} />
								<YAxis tick={{ fontSize: 12 }} />
								<Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Total"]} />
								<Legend />
								<Bar dataKey="total" fill="#82ca9d" isAnimationActive={!isFetching} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
