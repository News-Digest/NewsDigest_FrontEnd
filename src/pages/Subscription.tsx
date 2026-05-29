import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";
import { ArrowRight, Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$9/mo",
    description: "Perfect for casual readers who want curated headline access.",
    features: [
      "Daily premium newsletter",
      "Ad-free reading experience",
      "Access to editor picks"
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19/mo",
    description: "For power readers and professionals who want deeper coverage.",
    features: [
      "All Starter features",
      "Exclusive short-form insights",
      "Priority support",
      "Early access to new articles"
    ],
    highlight: true,
  },
  {
    name: "Elite",
    price: "$39/mo",
    description: "Best for teams and serious subscribers who need everything.",
    features: [
      "All Pro features",
      "Monthly premium research reports",
      "Members-only live briefings",
      "Custom industry alerts"
    ],
    highlight: false,
  },
];

export function Subscription() {
  return (
    <main className="container mx-auto px-4 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-600 font-bold mb-4">
          Premium Subscription
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
          Choose the plan that fits your news routine.
        </h1>
        <p className="mt-5 text-gray-600 text-lg leading-8">
          Unlock deeper analysis, faster access, and exclusive stories across business, tech, health, and more.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <section
            key={plan.name}
            className={`rounded-3xl border p-8 shadow-sm transition-all duration-200 ${plan.highlight ? "border-violet-600 bg-violet-50 shadow-violet-100" : "border-gray-200 bg-white hover:shadow-lg"}`}
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">{plan.name}</p>
                <p className="mt-3 text-4xl font-black text-gray-900">{plan.price}</p>
              </div>
              {plan.highlight && (
                <span className="rounded-full bg-violet-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Popular
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-8">{plan.description}</p>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-violet-600 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/auth?mode=sign-up" className="block">
              <Button
                variant={plan.highlight ? "primary" : "outline"}
                size="lg"
                className="w-full"
              >
                Start {plan.name}
              </Button>
            </Link>
          </section>
        ))}
      </div>

      <div className="mt-16 max-w-3xl mx-auto rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why go premium?</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl bg-violet-50 p-6">
            <p className="text-2xl font-bold text-violet-600">Fast</p>
            <p className="mt-3 text-sm text-gray-600">Get premium headlines and full analysis before anyone else.</p>
          </div>
          <div className="rounded-3xl bg-violet-50 p-6">
            <p className="text-2xl font-bold text-violet-600">Exclusive</p>
            <p className="mt-3 text-sm text-gray-600">Access stories, reports, and briefings only available to members.</p>
          </div>
          <div className="rounded-3xl bg-violet-50 p-6">
            <p className="text-2xl font-bold text-violet-600">Focused</p>
            <p className="mt-3 text-sm text-gray-600">Customize updates on the industries and topics you care about most.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
