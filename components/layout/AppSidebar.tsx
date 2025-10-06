"use client";

import { SignOutButton } from "@clerk/nextjs";
import {
  ChartNoAxesCombined,
  CreditCard,
  LayoutDashboard,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../common/logo";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

// menu items
const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
  { title: "Renewals", url: "/renewals", icon: RefreshCcw },
  { title: "Analytics", url: "/analytics", icon: ChartNoAxesCombined },
];

export default function AppSideBar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-r dark:bg-neutral-950/60 dark:border-neutral-800">
      <SidebarHeader className="flex-row items-center h-16 px-4 border-b dark:border-neutral-800 relative">
        <Link href={"/dashboard"}>
          <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
            <Logo />
            <span className="font-semibold tracking-tight">SubBuddy</span>
          </div>
        </Link>
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-neutral-300/70 to-transparent dark:via-neutral-700/70" />
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const active =
              pathname === item.url || pathname.startsWith(item.url + "/");
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                      "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                      active
                        ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/70 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30"
                        : "text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900",
                    ].join(" ")}
                  >
                    <Icon
                      className={
                        active
                          ? "h-5 w-5 text-blue-600 dark:text-blue-300"
                          : "h-5 w-5 text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                      }
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className="mt-4 px-1">
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-800" />
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t dark:border-neutral-800 p-3">
        <SignOutButton>
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
}
