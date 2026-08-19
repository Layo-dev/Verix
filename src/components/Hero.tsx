import { Button } from "@/components/ui/button";
import { Lock, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
      {/* Decorative glow */}
      <div className="hero-glow absolute inset-0 -z-10" aria-hidden="true" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground sm:text-sm">
            <Sparkles size={14} className="text-accent" />
            Trusted by thousands of users
          </span>

          <h1 className="section-title mb-6">
            Receive OTPs Without Using
            <br className="hidden sm:block" /> Your Personal Number.
          </h1>

          <p className="section-description mx-auto mb-8 max-w-xl">
            Rent secure virtual phone numbers for instant SMS verification on
            any platform — no SIM cards, no waiting.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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
        </div>

        {/* Lifestyle image */}
        <div className="relative mx-auto mt-14 max-w-5xl md:mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80"
              alt="Person checking SMS verification codes on a smartphone"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
