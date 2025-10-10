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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
// duplicate import removed
import { Label } from "@/components/ui/label";

export default function SubscriptionsPage() {
	const {
		subscriptions,
		loading,
		error,
		fetchSubscriptions,
		updateSubscription,
		cancelSubscription,
	} = useSubscriptionStore();
	const isFetching = loading === "fetching";

	// Filters
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<string | "all">("all");
	const [billingCycle, setBillingCycle] = useState<string | "all">("all");

	// Local state for dialogs
	const [viewing, setViewing] = useState<typeof subscriptions[number] | null>(null);
	const [editing, setEditing] = useState<typeof subscriptions[number] | null>(null);
	const [confirmCancel, setConfirmCancel] = useState<typeof subscriptions[number] | null>(null);
	const [editForm, setEditForm] = useState({ service: "", plan: "", amount: "", billingCycle: "monthly", status: "active", renewalDate: "" });

	useEffect(() => {
		fetchSubscriptions();
	}, [fetchSubscriptions]);

	useEffect(() => {
		if (editing) {
			setEditForm({
				service: editing.service || "",
				plan: editing.plan || "",
				amount: editing.amount != null ? String(editing.amount) : "",
				billingCycle: editing.billingCycle || "monthly",
				status: editing.status || "active",
				renewalDate: editing.renewalDate || "",
			});
		}
	}, [editing]);

	async function handleEditSave() {
		if (!editing?.id) return setEditing(null);
		const amountValue = editForm.amount ? parseFloat(editForm.amount) : undefined;
		await updateSubscription(editing.id, {
			service: editForm.service,
			plan: editForm.plan || null,
			amount: amountValue,
			billingCycle: editForm.billingCycle,
			status: editForm.status,
			renewalDate: editForm.renewalDate,
		});
		setEditing(null);
	}

	async function handleConfirmCancel() {
		if (!confirmCancel?.id) return setConfirmCancel(null);
		await cancelSubscription(confirmCancel.id);
		setConfirmCancel(null);
	}

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
		<>
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
													<DropdownMenuItem onClick={() => setViewing(s)}>View</DropdownMenuItem>
													<DropdownMenuItem onClick={() => setEditing(s)}>Edit</DropdownMenuItem>
													<DropdownMenuItem className="text-red-600" onClick={() => setConfirmCancel(s)}>Cancel</DropdownMenuItem>
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

		{/* View dialog */}
		<Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Subscription details</DialogTitle>
				</DialogHeader>
				{viewing ? (
					<div className="grid gap-2 text-sm">
						<div><span className="text-muted-foreground">Service:</span> {viewing.service}</div>
						<div><span className="text-muted-foreground">Plan:</span> {viewing.plan || "-"}</div>
						<div><span className="text-muted-foreground">Amount:</span> {viewing.amount != null ? `$${typeof viewing.amount === "number" ? viewing.amount.toFixed(2) : viewing.amount}` : "-"}</div>
						<div><span className="text-muted-foreground">Billing:</span> {viewing.billingCycle || "-"}</div>
						<div><span className="text-muted-foreground">Status:</span> {viewing.status || "-"}</div>
						<div><span className="text-muted-foreground">Next renewal:</span> {viewing.renewalDate ? new Date(viewing.renewalDate as string).toLocaleDateString() : "-"}</div>
					</div>
				) : null}
			</DialogContent>
		</Dialog>

		{/* Edit dialog */}
		<Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit subscription</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div>
						<Label className="text-sm">Service</Label>
						<Input value={editForm.service} onChange={(e) => setEditForm({ ...editForm, service: e.target.value })} />
					</div>
					<div>
						<Label className="text-sm">Plan</Label>
						<Input value={editForm.plan} onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })} />
					</div>
					<div>
						<Label className="text-sm">Amount (USD)</Label>
						<Input type="number" step="0.01" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} />
					</div>
					<div>
						<Label className="text-sm">Billing Cycle</Label>
						<Select value={editForm.billingCycle} onValueChange={(v) => setEditForm({ ...editForm, billingCycle: v })}>
							<SelectTrigger><SelectValue placeholder="Monthly" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="weekly">Weekly</SelectItem>
								<SelectItem value="monthly">Monthly</SelectItem>
								<SelectItem value="quarterly">Quarterly</SelectItem>
								<SelectItem value="yearly">Yearly</SelectItem>
								<SelectItem value="custom">Custom</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className="text-sm">Status</Label>
						<Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
							<SelectTrigger><SelectValue placeholder="Active" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="trial">Trial</SelectItem>
								<SelectItem value="paused">Paused</SelectItem>
								<SelectItem value="canceled">Canceled</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className="text-sm">Next Renewal</Label>
						<Input type="date" value={editForm.renewalDate} onChange={(e) => setEditForm({ ...editForm, renewalDate: e.target.value })} />
					</div>
				</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
					<Button onClick={handleEditSave}>Save</Button>
				</div>
			</DialogContent>
		</Dialog>

		{/* Cancel confirm */}
		<Dialog open={!!confirmCancel} onOpenChange={(o) => !o && setConfirmCancel(null)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancel subscription?</DialogTitle>
				</DialogHeader>
				<div className="text-sm text-muted-foreground">This will permanently delete this subscription.</div>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setConfirmCancel(null)}>Keep</Button>
					<Button variant="destructive" onClick={handleConfirmCancel}>Delete</Button>
				</div>
			</DialogContent>
		</Dialog>
		</>
	);
}
