import { Globe, Zap, MessageSquareText, Wallet } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Numbers from multiple countries.",
  },
  {
    icon: Zap,
    title: "Fast Activation",
    description: "Get your number in seconds.",
  },
  {
    icon: MessageSquareText,
    title: "Real-Time SMS",
    description: "Receive verification codes directly in your dashboard.",
  },
  {
    icon: Wallet,
    title: "Pay As You Go",
    description: "Only pay for the numbers you need.",
  },
];

const VirtualNumbers = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="section-label-caps mb-4">Virtual Numbers</p>
          <h2 className="section-title mb-5">
            One platform. Thousands of verification possibilities.
          </h2>
          <p className="section-description">
            Get temporary virtual numbers for SMS verification and online
            services without managing physical SIM cards.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10">
                <feature.icon size={20} className="text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VirtualNumbers;
