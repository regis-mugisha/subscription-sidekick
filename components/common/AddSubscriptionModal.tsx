"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

export function AddSubscriptionModal() {
  const { isModalOpen, closeModal, createSubscription, loading } =
    useSubscriptionStore();
  const isCreating = loading === "creating";

  const [service, setService] = useState("");
  const [plan, setPlan] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [status, setStatus] = useState("active");
  const [renewalDate, setRenewalDate] = useState("");

  function resetForm() {
    setService("");
    setPlan("");
    setAmount("");
    setBillingCycle("monthly");
    setStatus("active");
    setRenewalDate("");
  }

  async function handleSubmit() {
    const amountValue = parseFloat(amount);
    await createSubscription({
      service,
      plan,
      amount: amountValue,
      billingCycle,
      status,
      renewalDate,
    });
    resetForm();
  }

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Service Input */}
          <div>
            <Label className="text-sm">Service</Label>
            <Input
              placeholder="e.g. Netflix"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>
          {/* Plan Input */}
          <div>
            <Label className="text-sm">Plan</Label>
            <Input
              placeholder="e.g. Premium"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </div>
          {/* Amount Input */}
          <div>
            <Label className="text-sm">Amount (USD)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g. 15.99"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {/* Billing Cycle Select */}
          <div>
            <Label className="text-sm">Billing Cycle</Label>
            <Select
              value={billingCycle}
              onValueChange={(value: string) => setBillingCycle(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Monthly" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Status Select */}
          <div>
            <Label className="text-sm">Status</Label>
            <Select
              value={status}
              onValueChange={(value: string) => setStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Active" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Renewal Date Input */}
          <div>
            <Label className="text-sm">Next Renewal</Label>
            <Input
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!service || !amount || !renewalDate || isCreating}
            data-loading={isCreating || undefined}
            className="group relative disabled:opacity-100"
          >
            <span className="group-data-loading:text-transparent">Save</span>
            {isCreating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoaderCircleIcon
                  className="animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
