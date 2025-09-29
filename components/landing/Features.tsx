import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, LayoutDashboard, PieChart, Gauge, ShieldCheck, CalendarClock } from "lucide-react";

type FeatureCardProps = {
  title: string;
  desc: string;
  children: React.ReactNode;
};

function FeatureCard({ title, desc, children }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          {children}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">{desc}</CardContent>
    </Card>
  );
}

export function Features() {
  return (
    <section className="container mx-auto px-4 py-16" id="features">
      <h2 className="text-3xl font-semibold text-center">Key features</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard title="Proactive reminders" desc="Daily checks so you never miss renewals.">
          <Bell className="h-5 w-5 text-primary" />
        </FeatureCard>
        <FeatureCard title="Unified dashboard" desc="Monthly and annual totals at a glance.">
          <LayoutDashboard className="h-5 w-5 text-primary" />
        </FeatureCard>
        <FeatureCard title="Visual breakdown" desc="See spend by category with clean charts.">
          <PieChart className="h-5 w-5 text-primary" />
        </FeatureCard>
        <FeatureCard title="Usage score" desc="Highlight rarely-used, expensive subscriptions.">
          <Gauge className="h-5 w-5 text-primary" />
        </FeatureCard>
        <FeatureCard title="Simple tracking" desc="Add subscriptions in seconds with helpful defaults.">
          <CalendarClock className="h-5 w-5 text-primary" />
        </FeatureCard>
        <FeatureCard title="Your data, private" desc="Secure, account-based access and control.">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </FeatureCard>
      </div>
    </section>
  );
}

export default Features;


