import { Button } from "@/components/ui/button";
import { Check, Lock, Play } from "lucide-react";
import PhoneMockup from "./PhoneMockup";

const Hero = () => {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-6 shadow-sm">
              <span className="text-lg">✨</span>
              <span className="text-sm font-medium text-accent">4.9 {'{'}6k+Reviews{'}'}</span>
              <span className="text-sm text-muted-foreground">by Trustpilot</span>
            </div>

            {/* Heading */}
            <h1 className="section-title mb-6">
              Simplify management and payments from a single platform
            </h1>

            {/* Description */}
            <p className="section-description mb-8">
              Meet the new standard for a modern card platform. Launch your product, issue cards, and grow your revenue.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="hero" size="lg" className="gap-2">
                <Lock size={18} />
                Open An Account
              </Button>
              <Button variant="heroOutline" size="lg" className="gap-2">
                <Play size={18} />
                Watch Demo
              </Button>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={16} className="text-accent" />
                No credit card required
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={16} className="text-accent" />
                Fast acceptance
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end pb-24 sm:pb-28">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
