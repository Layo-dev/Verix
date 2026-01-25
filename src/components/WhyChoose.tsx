import { Button } from "@/components/ui/button";
import { ArrowUpRight, Cloud, Lock, Shield, Users } from "lucide-react";

const WhyChoose = () => {
  const features = [
    {
      icon: Cloud,
      title: "Cloud-based API",
      description: "APIs are designed to simplify the development process by abstracting the underlying complexity of software systems.",
    },
    {
      icon: Users,
      title: "Powered by people",
      description: "APIs are designed to simplify the development process by abstracting the underlying complexity of software systems.",
    },
    {
      icon: Shield,
      title: "Safe and secure to stay",
      description: "APIs are designed to simplify the development process by abstracting the underlying complexity of software systems.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start lg:items-center">
          {/* Left Content */}
          <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
            <p className="section-label mb-3 sm:mb-4">{'{'} Why Choose E-Bank {'}'}</p>
            <h2 className="section-title mb-4 sm:mb-6">
              Financial technology with banking license, and expert guidance
            </h2>
            <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto min-h-[44px]">
              <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
              Open An Account
            </Button>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-3 sm:space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow flex gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={20} className="sm:w-6 sm:h-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">{feature.description}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 self-center">
                  <ArrowUpRight size={14} className="sm:w-[18px] sm:h-[18px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;