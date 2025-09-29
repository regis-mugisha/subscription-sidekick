import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Benefits() {
  return (
    <section className="container mx-auto px-4 py-16" id="benefits">
      <h2 className="text-3xl font-semibold text-center">Why you’ll love it</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Saves money</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">Avoid surprise charges by catching renewals before they hit.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reduces stress</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">No more mental spreadsheets—everything is organized for you.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stay organized</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">One place for subscriptions, trials, and upcoming dates.</CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Benefits;


