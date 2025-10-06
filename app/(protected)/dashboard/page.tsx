"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
 
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useUser } from "@clerk/nextjs";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useMemo } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "there";

  const {
    subscriptions,
    monthlyExpenditure,
    activeSubscriptions,
    loading,
    error,
    fetchSubscriptions,
    getMonthlyExpenditure,
    getActiveSubscriptions,
  } = useSubscriptionStore();
  const isFetching = loading === "fetching";

  const upcomingRenewalsCount = useMemo(() => {
    const now = new Date();
    return subscriptions.filter((s) => {
      if (!s.renewalDate) return false;
      const d = new Date(s.renewalDate);
      const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 3 && diffDays <= 5;
    }).length;
  }, [subscriptions]);

  const monthProgress = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const totalDays = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();
    return Math.min(100, Math.max(0, Math.round((today / totalDays) * 100)));
  }, []);

  // Derive next-30-days renewals count if needed later
  // const upcomingRenewalsCount = useMemo(() => {
  //   const now = new Date();
  //   const in30d = new Date();
  //   in30d.setDate(now.getDate() + 30);
  //   return subscriptions.filter((s) => {
  //     if (!s.renewalDate) return false;
  //     const d = new Date(s.renewalDate);
  //     return d >= now && d <= in30d;
  //   }).length;
  // }, [subscriptions]);

  useEffect(() => {
    getMonthlyExpenditure();
    getActiveSubscriptions();
    fetchSubscriptions();
  }, [fetchSubscriptions, getMonthlyExpenditure, getActiveSubscriptions]);

  return (
    <div className="space-y-6 pt-4 md:pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here’s what’s happening with your subscriptions
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Spend (Monthly)</CardDescription>
            <CardTitle className="text-2xl">
              {isFetching ? <Skeleton className="h-7 w-24" /> : `$${monthlyExpenditure}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* intentionally minimal footer */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Subscriptions</CardDescription>
            <CardTitle className="text-2xl">
              {isFetching ? <Skeleton className="h-7 w-12" /> : activeSubscriptions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* intentionally minimal footer */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Renewals (3–5d)</CardDescription>
            <CardTitle className="text-2xl">
              {isFetching ? <Skeleton className="h-7 w-10" /> : upcomingRenewalsCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={45} className="h-2" />
            <div className="mt-2 text-xs text-muted-foreground">
              45% of this month processed
            </div>
          </CardContent>
        </Card>
        
      </section>

      <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Subscriptions</CardTitle>
                <CardDescription>
                  Latest subscriptions added or updated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Renewal</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFetching && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {!isFetching && error && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="text-sm text-red-600">{error}</div>
                        </TableCell>
                      </TableRow>
                    )}
                    {!isFetching && !error && subscriptions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="text-sm text-muted-foreground">
                            No subscriptions yet.
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {!isFetching &&
                      !error &&
                      subscriptions.map((s, idx) => {
                        const serviceInitials = (s.service || "?")
                          .slice(0, 2)
                          .toUpperCase();
                        const statusLabel = s.status ?? "unknown";
                        const renewalLabel = s.renewalDate
                          ? new Date(s.renewalDate).toLocaleDateString()
                          : "-";
                        return (
                          <TableRow key={s.id ?? `${s.service}-${idx}`}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="" alt="" />
                                  <AvatarFallback>
                                    {serviceInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{s.service}</div>
                                  {s.amount != null && (
                                    <div className="text-xs text-muted-foreground">
                                      $
                                      {typeof s.amount === "number"
                                        ? s.amount.toFixed(2)
                                        : s.amount}
                                      /mo
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{s.plan ?? "-"}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{statusLabel}</Badge>
                            </TableCell>
                            <TableCell>{renewalLabel}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <EllipsisVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40"
                                >
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Cancel
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Renewals</CardTitle>
                <CardDescription>Next 3–5 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[340px] pr-4">
                  <div className="space-y-4">
                    {subscriptions
                      .filter((s) => {
                        if (!s.renewalDate) return false;
                        const now = new Date();
                        const d = new Date(s.renewalDate);
                        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        return diffDays >= 3 && diffDays <= 5;
                      })
                      .sort((a, b) =>
                        new Date(a.renewalDate).getTime() -
                        new Date(b.renewalDate).getTime()
                      )
                      .slice(0, 8)
                      .map((s, idx) => {
                        const initials = (s.service || "?").slice(0, 2).toUpperCase();
                        const amountLabel =
                          s.amount != null
                            ? `$${typeof s.amount === "number" ? s.amount.toFixed(2) : s.amount}`
                            : "-";
                        const daysAway = (() => {
                          const now = new Date();
                          const d = new Date(s.renewalDate!);
                          return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        })();
                        return (
                          <div key={s.id ?? `${s.service}-${idx}`} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt="" />
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{s.service}</div>
                                <div className="text-xs text-muted-foreground">{amountLabel}/mo</div>
                              </div>
                            </div>
                            <div className="text-sm">in {daysAway} days</div>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">
                    {monthProgress}% of this month processed
                  </div>
                  <Progress value={monthProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
