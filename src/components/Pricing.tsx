import { Button } from "@/components/ui/button";
import { Check, Rocket, Users, X, Zap } from "lucide-react";
import { useState } from "react";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: Rocket,
      price: isYearly ? 6 : 8,
      popular: false,
      features: [
        { text: "No credit card required", included: true },
        { text: "Description can be added here", included: true },
        { text: "Fast acceptance", included: false },
      ],
    },
    {
      name: "Professional",
      icon: Users,
      price: isYearly ? 38 : 48,
      popular: true,
      features: [
        { text: "No credit card required", included: true },
        { text: "Description can be added here", included: true },
        { text: "Fast acceptance", included: false },
      ],
    },
    {
      name: "Enterprise",
      icon: Zap,
      price: isYearly ? 69 : 89,
      popular: false,
      features: [
        { text: "No credit card required", included: true },
        { text: "Description can be added here", included: true },
        { text: "Fast acceptance", included: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-label mb-4">{'{'} Portable Pricing system {'}'}</p>
          <h2 className="section-title mb-6">Explore our pricing plans</h2>
          <p className="section-description">
            We help to keep track of your expenses and incomes. It shows the flow of records over a specific period of time. such as weekly, monthly or re*wly
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !isYearly ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              isYearly ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
          >
            Yearly
            <span className="text-xs text-accent">10%off</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-6 md:p-8 border transition-all ${
                plan.popular
                  ? 'bg-accent text-accent-foreground border-accent shadow-xl scale-105'
                  : 'bg-card border-border hover:border-accent/30 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-background text-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl ${plan.popular ? 'bg-accent-foreground/20' : 'bg-muted'} flex items-center justify-center mb-4`}>
                  <plan.icon size={24} className={plan.popular ? 'text-accent-foreground' : 'text-foreground'} />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-4xl font-bold">
                  <span className="text-lg align-top">$</span>
                  {plan.price}.00
                  <span className={`text-sm font-normal ${plan.popular ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>
                    (Per month)
                  </span>
                </p>
              </div>

              <Button
                variant={plan.popular ? "outline" : "default"}
                className={`w-full mb-6 ${plan.popular ? 'bg-background text-foreground hover:bg-muted border-0' : ''}`}
                size="lg"
              >
                Get Started
              </Button>

              <p className={`text-sm mb-4 ${plan.popular ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>
                Additional information can be added here
              </p>

              <div className="pt-4 border-t border-current/10">
                <p className={`text-sm font-medium mb-4 ${plan.popular ? 'text-accent-foreground' : 'text-foreground'}`}>
                  What's included:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm">
                      {feature.included ? (
                        <Check size={16} className={plan.popular ? 'text-accent-foreground' : 'text-success'} />
                      ) : (
                        <X size={16} className={plan.popular ? 'text-accent-foreground/50' : 'text-muted-foreground'} />
                      )}
                      <span className={!feature.included ? (plan.popular ? 'text-accent-foreground/50' : 'text-muted-foreground') : ''}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
