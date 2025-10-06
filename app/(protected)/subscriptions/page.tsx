"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { EllipsisVertical, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function SubscriptionsPage() {
	const {
		subscriptions,
		loading,
		error,
		fetchSubscriptions,
	} = useSubscriptionStore();
	const isFetching = loading === "fetching";

	// Filters
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<string | "all">("all");
	const [billingCycle, setBillingCycle] = useState<string | "all">("all");

	useEffect(() => {
		fetchSubscriptions();
	}, [fetchSubscriptions]);

	const filtered = useMemo(() => {
		return subscriptions.filter((s) => {
			const matchesQuery = query
				? (s.service || "").toLowerCase().includes(query.toLowerCase()) ||
				  (s.plan || "").toLowerCase().includes(query.toLowerCase())
				: true;
			const matchesStatus = status === "all" ? true : (s.status || "").toLowerCase() === status;
			const matchesCycle =
				billingCycle === "all" ? true : (s.billingCycle || "").toLowerCase() === billingCycle;
			return matchesQuery && matchesStatus && matchesCycle;
		});
	}, [subscriptions, query, status, billingCycle]);

	return (
		<div className="space-y-6 pt-4 md:pt-6">
			{/* Page title */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">Subscriptions</h1>
					<p className="text-sm text-muted-foreground">Manage and review all your subscriptions</p>
				</div>
			</div>

			{/* Filter controls */}
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				<div className="relative">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by service or plan"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="pl-8"
					/>
				</div>
				<Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
					<SelectTrigger>
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="trial">Trial</SelectItem>
						<SelectItem value="paused">Paused</SelectItem>
						<SelectItem value="canceled">Canceled</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={billingCycle}
					onValueChange={(v) => setBillingCycle(v as typeof billingCycle)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Billing cycle" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All cycles</SelectItem>
						<SelectItem value="weekly">Weekly</SelectItem>
						<SelectItem value="monthly">Monthly</SelectItem>
						<SelectItem value="quarterly">Quarterly</SelectItem>
						<SelectItem value="yearly">Yearly</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Subscriptions table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Service</TableHead>
							<TableHead>Plan</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Billing</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Next Renewal</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isFetching && (
							<TableRow>
								<TableCell colSpan={7}>
									<div className="flex items-center gap-3">
										<Skeleton className="h-4 w-48" />
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-4 w-16" />
									</div>
								</TableCell>
							</TableRow>
						)}
						{!isFetching && error && (
							<TableRow>
								<TableCell colSpan={7}>
									<div className="text-sm text-red-600">{error}</div>
								</TableCell>
							</TableRow>
						)}
						{!isFetching && !error && filtered.length === 0 && (
							<TableRow>
								<TableCell colSpan={7}>
									<div className="text-sm text-muted-foreground">No matching subscriptions.</div>
								</TableCell>
							</TableRow>
						)}
						{!isFetching && !error &&
							filtered.map((s, idx) => {
								const statusLabel = s.status ?? "unknown";
								const cycleLabel = s.billingCycle ?? "-";
								const renewalLabel = s.renewalDate
									? new Date(s.renewalDate).toLocaleDateString()
									: "-";
								const amountLabel =
									s.amount != null
										? typeof s.amount === "number"
											? `$${s.amount.toFixed(2)}`
											: `$${s.amount}`
										: "-";
								return (
									<TableRow key={s.id ?? `${s.service}-${idx}`}>
										<TableCell className="font-medium">{s.service}</TableCell>
										<TableCell>{s.plan ?? "-"}</TableCell>
										<TableCell>
											<Badge variant="secondary">{statusLabel}</Badge>
										</TableCell>
										<TableCell className="capitalize">{cycleLabel}</TableCell>
										<TableCell>{amountLabel}</TableCell>
										<TableCell>{renewalLabel}</TableCell>
										<TableCell className="text-right">
											{/* Actions dropdown */}
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon" className="h-8 w-8">
														<EllipsisVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-40">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuItem>View</DropdownMenuItem>
													<DropdownMenuItem>Edit</DropdownMenuItem>
													<DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
