import { toast } from "sonner";
import { create } from "zustand";

type Subscription = {
  id?: string;
  service: string;
  plan: string | null;
  status: string | null;
  billingCycle: string | null;
  renewalDate: string;
  amount?: number | null;
};

type SubscriptionState = {
  subscriptions: Subscription[];
  loading: "idle" | "fetching" | "creating";
  error: string | null;
  isModalOpen: boolean;
  monthlyExpenditure: number;
  activeSubscriptions: Subscription[];
};

type SubscriptionActions = {
  openModal: () => void;
  closeModal: () => void;
  fetchSubscriptions: () => Promise<void>;
  createSubscription: (
    newSubscription: Omit<Subscription, "id">
  ) => Promise<void>;
  getMonthlyExpenditure: () => Promise<void>;
  getActiveSubscriptions: () => Promise<void>;
};

export const useSubscriptionStore = create<
  SubscriptionState & SubscriptionActions
>((set, get) => ({
  // INITIAL STATE
  subscriptions: [],
  loading: "idle",
  error: null,
  isModalOpen: false,
  monthlyExpenditure: 0,
  activeSubscriptions: [],

  // ACTIONS
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  fetchSubscriptions: async () => {
    set({ loading: "fetching", error: null });
    try {
      const res = await fetch("/api/subscriptions");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to load (${res.status})`);
      }

      const data = await res.json();
      set({
        subscriptions: Array.isArray(data?.subscriptions)
          ? data.subscriptions
          : [],
        loading: "idle",
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(error);
      set({ error: errorMessage, loading: "idle" });
    }
  },
  createSubscription: async (newSubscription) => {
    set({ loading: "creating" });
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubscription),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || "Failed to save");
        set({ loading: "idle" });
        return;
      }

      toast.success("Subscription added");
      get().closeModal();
      await get().fetchSubscriptions();
      await get().getMonthlyExpenditure();
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      set({ loading: "idle" });
    }
  },
  getMonthlyExpenditure: async () => {
    set({ loading: "fetching" });
    try {
      const res = await fetch("/api/subscriptions/monthly-total");

      if (!res.ok) {
        throw new Error("Failed to fetch monthly expenditure");
      }
      const data = await res.json();
      set({ monthlyExpenditure: data.monthlyExpenditure || 0 });
    } catch (error) {
      console.error("Error fetching monthly expenditure:", error);
    } finally {
      set({ loading: "idle" });
    }
  },
  getActiveSubscriptions: async () => {
    set({ loading: "fetching" });
    try {
      const res = await fetch("/api/subscriptions/active");
      if (!res.ok) {
        throw new Error("Failed to fetch active subscriptions");
      }
      const data = await res.json();
      set({ activeSubscriptions: data.subscriptions || [] });
    } catch (error) {
      console.error("Error fetching active subscriptions:", error);
    } finally {
      set({ loading: "idle" });
    }
  },
}));
