"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export default function AppHeader() {
  const { openModal } = useSubscriptionStore();

  return (
    <div className="flex items-center h-16 px-4 border-b">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-3">
        <Button onClick={openModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Subscription
        </Button>
        <UserButton />
      </div>
    </div>
  );
}
