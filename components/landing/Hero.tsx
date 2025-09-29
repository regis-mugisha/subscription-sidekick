import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
          Beta
        </span>
        <span className="text-sm text-muted-foreground">Free during beta</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Stop paying for subscriptions you don’t use.
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        Subscription Sidekick tracks renewals and free trials, sends proactive
        reminders, and highlights what to cancel.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button size="lg" asChild>
          <Link href="/sign-up">Get Started</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="#features">See Features</a>
        </Button>
      </div>
      <div className="mt-12 rounded-xl border bg-card shadow-xl p-3">
        <div className="aspect-[16/9] w-full rounded-lg bg-muted flex items-center justify-center">
          <div className="text-muted-foreground">
            Product preview coming soon
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
