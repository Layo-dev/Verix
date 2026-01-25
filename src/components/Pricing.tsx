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
    <section id="pricing" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">
          <p className="section-label mb-3 sm:mb-4">{'{'} Portable Pricing system {'}'}</p>
          <h2 className="section-title mb-4 sm:mb-6">Explore our pricing plans</h2>
          <p className="section-description px-2">
            We help to keep track of your expenses and incomes. It shows the flow of records over a specific period of time. such as weekly, monthly or re*wly
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors min-h-[44px] ${
              !isYearly ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 min-h-[44px] ${
              isYearly ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
          >
            Yearly
            <span className="text-[10px] sm:text-xs text-accent">10%off</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border transition-all ${
                plan.popular
                  ? 'bg-accent text-accent-foreground border-accent shadow-xl sm:scale-105 order-first sm:order-none'
                  : 'bg-card border-border hover:border-accent/30 hover:shadow-lg'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-background text-foreground text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${plan.popular ? 'bg-accent-foreground/20' : 'bg-muted'} flex items-center justify-center mb-3 sm:mb-4`}>
                  <plan.icon size={20} className={`sm:w-6 sm:h-6 ${plan.popular ? 'text-accent-foreground' : 'text-foreground'}`} />
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  <span className="text-sm sm:text-lg align-top">$</span>
                  {plan.price}.00
                  <span className={`text-[10px] sm:text-sm font-normal block sm:inline mt-1 sm:mt-0 ${plan.popular ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>
                    (Per month)
                  </span>
                </p>
              </div>

              <Button
                variant={plan.popular ? "outline" : "default"}
                className={`w-full mb-4 sm:mb-6 min-h-[44px] ${plan.popular ? 'bg-background text-foreground hover:bg-muted border-0' : ''}`}
                size="lg"
              >
                Get Started
              </Button>

              <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${plan.popular ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>
                Additional information can be added here
              </p>

              <div className="pt-3 sm:pt-4 border-t border-current/10">
                <p className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${plan.popular ? 'text-accent-foreground' : 'text-foreground'}`}>
                  What's included:
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      {feature.included ? (
                        <Check size={14} className={`sm:w-4 sm:h-4 flex-shrink-0 ${plan.popular ? 'text-accent-foreground' : 'text-success'}`} />
                      ) : (
                        <X size={14} className={`sm:w-4 sm:h-4 flex-shrink-0 ${plan.popular ? 'text-accent-foreground/50' : 'text-muted-foreground'}`} />
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