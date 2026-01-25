import { Button } from "@/components/ui/button";
import { Check, Lock, Play } from "lucide-react";
import PhoneMockup from "./PhoneMockup";

const Hero = () => {
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero -z-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 shadow-sm">
              <span className="text-base sm:text-lg">✨</span>
              <span className="text-xs sm:text-sm font-medium text-accent">4.9 {'{'}6k+Reviews{'}'}</span>
              <span className="text-xs sm:text-sm text-muted-foreground hidden xs:inline">by Trustpilot</span>
            </div>

            {/* Heading */}
            <h1 className="section-title mb-4 sm:mb-6">
              Simplify management and payments from a single platform
            </h1>

            {/* Description */}
            <p className="section-description mb-6 sm:mb-8">
              Meet the new standard for a modern card platform. Launch your product, issue cards, and grow your revenue.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="gap-2 w-full xs:w-auto min-h-[44px]">
                <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
                Open An Account
              </Button>
              <Button variant="heroOutline" size="lg" className="gap-2 w-full xs:w-auto min-h-[44px]">
                <Play size={16} className="sm:w-[18px] sm:h-[18px]" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Check size={14} className="sm:w-4 sm:h-4 text-accent" />
                No credit card required
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Check size={14} className="sm:w-4 sm:h-4 text-accent" />
                Fast acceptance
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end mt-8 sm:mt-12 lg:mt-0 pb-16 sm:pb-8 lg:pb-0">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
