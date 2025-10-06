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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useUser } from "@clerk/nextjs";
import { EllipsisVertical, LoaderCircleIcon } from "lucide-react";
import { useEffect } from "react";

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

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Spend (Monthly)</CardDescription>
            <CardTitle className="text-2xl">
              {isFetching ? (
                <LoaderCircleIcon className="animate-spin" size={24} />
              ) : (
                `$${monthlyExpenditure}`
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400 font-medium">
                +4.2%
              </span>{" "}
              from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Subscriptions</CardDescription>
            <CardTitle className="text-2xl">
              {isFetching ? (
                <LoaderCircleIcon className="animate-spin" size={24} />
              ) : (
                activeSubscriptions.length
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">3 trials</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Renewals (30d)</CardDescription>
            <CardTitle className="text-2xl">6</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={45} className="h-2" />
            <div className="mt-2 text-xs text-muted-foreground">
              45% of this month processed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Failed Payments (7d)</CardDescription>
            <CardTitle className="text-2xl">2</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">Attention</Badge>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <LoaderCircleIcon
                              className="animate-spin"
                              size={16}
                            />
                            Loading subscriptions...
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
                <CardDescription>Next 14 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[340px] pr-4">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt="" />
                            <AvatarFallback>NF</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Netflix</div>
                            <div className="text-xs text-muted-foreground">
                              $15.99/mo
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">in {i} days</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">
                    This month progress
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Subscription changes and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <div className="h-4 w-[240px] rounded bg-muted" />
                      <div className="h-3 w-[180px] rounded bg-muted/70" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
