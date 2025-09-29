import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProblemSolution() {
  return (
    <section className="container mx-auto px-4 py-16" id="problem">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>We all forget free trials and renewals</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Free trials end silently. Small monthly charges add up. Manually tracking renewals is tedious—and expensive when you forget.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Sidekick fixes that</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Add your subscriptions once. See clear monthly/annual totals. Get email and in-app reminders 3 days before renewals and trial endings.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ProblemSolution;


