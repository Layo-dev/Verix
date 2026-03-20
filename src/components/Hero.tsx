import { Button } from "@/components/ui/button";
import { Check, Lock, Play } from "lucide-react";
// import PhoneMockup from "./PhoneMockup";
import HeroImage from "@/assets/Hero-image.webp";

const Hero = () => {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            
            {/* Heading */}
            <h1 className="section-title mb-6">
              Receive OTPs Without Using Your Personal Number
            </h1>

            {/* Description */}
            <p className="section-description mb-8">
              Rent secure virtual phone numbers for instant SMS verification on any platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="hero" size="lg" className="gap-2">
                <Lock size={18} />
                Open An Account
              </Button>
              <Button variant="heroOutline" size="lg" className="gap-2">
                <Play size={18} />
                Buy a Number
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
            {/* <PhoneMockup /> */}
            <img src={HeroImage} alt="Verix virtual number app" className="w-72 md:w-80 object-contain animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
