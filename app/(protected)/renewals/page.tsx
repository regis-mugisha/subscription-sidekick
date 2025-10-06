"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptionStore } from "@/store/subscriptionStore";
 
import { useEffect, useMemo } from "react";

export default function RenewalsPage() {
	const { subscriptions, loading, error, fetchSubscriptions } = useSubscriptionStore();
	const isFetching = loading === "fetching";

	useEffect(() => {
		fetchSubscriptions();
	}, [fetchSubscriptions]);

	const upcoming = useMemo(() => {
		const now = new Date();
		return subscriptions.filter((s) => {
			if (!s.renewalDate) return false;
			const renewal = new Date(s.renewalDate);
			// Compute whole days difference (renewal - now)
			const diffMs = renewal.getTime() - now.getTime();
			const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
			return days >= 3 && days <= 5;
		});
	}, [subscriptions]);

	return (
		<div className="space-y-6 pt-4 md:pt-6">
			{/* Page title */}
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Upcoming Renewals</h1>
				<p className="text-sm text-muted-foreground">Subscriptions due in 3–5 days</p>
			</div>

			<Card>
				<CardHeader className="pb-2">
					<CardTitle>Renewals (3–5 days)</CardTitle>
				</CardHeader>
				<CardContent>
                    {isFetching && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-56" />
                                    <Skeleton className="h-3 w-28" />
                                </div>
                            </div>
                        </div>
                    )}
					{!isFetching && error && (
						<div className="text-sm text-red-600">{error}</div>
					)}
					{!isFetching && !error && upcoming.length === 0 && (
						<div className="text-sm text-muted-foreground">No renewals in the next 3–5 days.</div>
					)}
					{!isFetching && !error && upcoming.length > 0 && (
						<div className="divide-y">
							{upcoming.map((s, idx) => {
								const initials = (s.service || "?").slice(0, 2).toUpperCase();
								const renewalLabel = s.renewalDate ? new Date(s.renewalDate).toLocaleDateString() : "-";
								const amountLabel = s.amount != null ? `$${typeof s.amount === "number" ? s.amount.toFixed(2) : s.amount}` : "-";
								const daysAway = (() => {
									const now = new Date();
									const renewal = s.renewalDate ? new Date(s.renewalDate) : now;
									const diffMs = renewal.getTime() - now.getTime();
									return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
								})();
								return (
									<div key={s.id ?? `${s.service}-${idx}`} className="flex items-center justify-between py-3">
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage src="" alt="" />
												<AvatarFallback>{initials}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{s.service}</div>
												<div className="text-xs text-muted-foreground">
													{amountLabel} {s.billingCycle ? `/${s.billingCycle === "monthly" ? "mo" : s.billingCycle}` : ""}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<Badge variant="secondary">in {daysAway} days</Badge>
											<div className="text-sm text-muted-foreground">{renewalLabel}</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
