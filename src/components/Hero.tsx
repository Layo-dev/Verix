import { Button } from "@/components/ui/button";
import { Check, Lock, Play } from "lucide-react";
// import PhoneMockup from "./PhoneMockup";
import HeroImage from "@/assets/Hero-image.jpeg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-24 md:pt-24 pb-16 md:pb-8 overflow-hidden overflow-x-hidden">
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
              <Link to="/signup"> 
               <Button variant="hero" size="lg" className="gap-2">
                 <Lock size={18} />
                 Open An Account
               </Button>
              </Link> 
              <Link to="/dashboard"> 
                <Button variant="heroOutline" size="lg" className="gap-2">
                 <Play size={18} />
                 Buy a Number
               </Button>
              </Link> 
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={16} className="text-accent" />
                Secure and reliable
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check size={16} className="text-accent" />
                Instant payments
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end pb-16 sm:pb-16">
            {/* <PhoneMockup /> */}
            <img src={HeroImage} alt="Verix virtual number app" className="w-96 md:w-96 object-contain animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
