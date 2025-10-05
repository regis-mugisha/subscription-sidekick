import { AddSubscriptionModal } from "@/components/common/AddSubscriptionModal";
import AppHeader from "@/components/layout/AppHeader";
import AppSideBar from "@/components/layout/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <SidebarInset className="flex-1 flex flex-col h-screen">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
      <AddSubscriptionModal />
    </SidebarProvider>
  );
}
