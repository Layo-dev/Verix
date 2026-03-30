import { SiAmazon, SiFacebook, SiTiktok, SiX, SiWhatsapp, SiGoogle } from "react-icons/si";
import { Ticket } from "lucide-react";

const services = [
  { name: "Amazon", icon: SiAmazon, count: "967761 pcs", price: "$0.03" },
  { name: "Ticketmaster", icon: Ticket, count: "845320 pcs", price: "$0.05" },
  { name: "Google / YouTube / Gmail", icon: SiGoogle, count: "723194 pcs", price: "$0.04" },
  { name: "Facebook", icon: SiFacebook, count: "612487 pcs", price: "$0.03" },
  { name: "TikTok / Douyin", icon: SiTiktok, count: "534892 pcs", price: "$0.04" },
  { name: "Twitter", icon: SiX, count: "498215 pcs", price: "$0.03" },
  { name: "WhatsApp", icon: SiWhatsapp, count: "421376 pcs", price: "$0.45" },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-label mb-4">{'{'} Service Pricing {'}'}</p>
          <h2 className="section-title mb-6">Popular services and prices</h2>
          <p className="section-description">
            Get virtual numbers for SMS verification at the lowest prices. Choose from hundreds of services.
          </p>
        </div>

        {/* Service List */}
        <div className="max-w-3xl mx-auto space-y-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between bg-card rounded-2xl px-5 py-4 border border-border/50 hover:border-accent/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <service.icon size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.count}</p>
                </div>
              </div>
              <span className="bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                up to {service.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
