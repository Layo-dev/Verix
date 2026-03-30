import { Button } from "@/components/ui/button";
import { Lock, MousePointerClick, Settings, ShoppingCart, Smartphone, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Selection",
    description: "Begin by choosing the appropriate service from the Receive SMS page that matches your needs.",
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Indicate your preferred country and the quantity of SMS you require.",
  },
  {
    icon: ShoppingCart,
    title: "Purchase",
    description: "Proceed by clicking the Buy Now icon to secure your SMS for verification.",
  },
  {
    icon: Smartphone,
    title: "Activation",
    description: "Provided SMS for verification will be displayed on the SMS Inbox page.",
  },
  {
    icon: MessageSquare,
    title: "Receiving SMS",
    description: "The verification code will appear next to your SMS, ready for use.",
  },
];

const Dashboard = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Top Content */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="section-label mb-4">{'{'} Guide to receive SMS codes {'}'}</p>
          <h2 className="section-title mb-6">
            How to receive SMS verification codes
          </h2>
          <p className="section-description mb-8">
            The Verix service provides temporary phone numbers for SMS verification. Follow these simple steps to get started.
          </p>
          <Button variant="hero" size="lg" className="gap-2">
            <Lock size={18} />
            Open An Account
          </Button>
        </div>

        {/* 5 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <step.icon size={22} className="text-accent" />
              </div>
              <span className="text-xs text-muted-foreground font-medium mb-1 block">Step {index + 1}</span>
              <h3 className="font-semibold text-foreground mb-2 text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
