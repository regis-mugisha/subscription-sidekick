import { SignUpButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export function BottomCTA() {
  return (
    <section className="container mx-auto px-4 py-16" id="cta">
      <div className="rounded-xl border p-8 md:p-12 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold">
          Take control of your subscriptions today
        </h3>
        <p className="mt-2 text-muted-foreground">
          Start free—set up takes minutes, and you can cancel anytime.
        </p>
        <div className="mt-6">
          <SignUpButton mode="modal">
            <Button size="lg" className="text-sm">
              Sign Up Free
            </Button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}

export default BottomCTA;
