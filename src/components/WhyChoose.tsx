import { Button } from "@/components/ui/button";
import { ArrowUpRight, Cloud, Lock, Shield, Users } from "lucide-react";

const WhyChoose = () => {
  const features = [
    {
      icon: Cloud,
      title: "Instant Access to Virtual Numbers ",
      description:"Get your number in seconds no waiting, no hassle. Verix makes it simple to start communicating right away.",
    },
    {
      icon: Users,
      title: "Global Reach",
      description: "Access virtual numbers in over 180 countries, perfect for international business needs.",
    },
    {
      icon: Shield,
      title: "Secure and Reliable",
      description: "Your privacy is our priority. Verix ensures secure transactions and dependable service so you can focus on what’s important."
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero -z-10" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-lg">
            <p className="section-label mb-4">{'{'} Why Choose Verix {'}'}</p>
            <h2 className="section-title mb-6">
            Instant Access to Virtual Numbers  
            Get your number in seconds.
            </h2>
            <Button variant="hero" size="lg" className="gap-2">
              <Lock size={18} />
              Open An Account
            </Button>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow flex gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon size={24} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <ArrowUpRight size={18} />
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
