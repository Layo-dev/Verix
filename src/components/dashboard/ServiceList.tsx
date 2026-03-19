import { useState } from "react";
import type { IconType } from "react-icons";
import {
  SiFacebook,
  SiGoogle,
  SiWhatsapp,
  SiTelegram,
  SiInstagram,
  SiX,
  SiTiktok,
  SiDiscord,
  SiApple,
  SiAmazon,
  SiSpotify,
  SiNetflix,
  SiUber,
  SiPaypal,
} from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ServiceItem {
  id: string;
  name: string;
  count: number;
  price: number;
  icon: IconType;
}

export const services: ServiceItem[] = [
  { id: "facebook", name: "Facebook", count: 12450, price: 0.15, icon: SiFacebook },
  { id: "google", name: "Google/Gmail", count: 8920, price: 0.25, icon: SiGoogle },
  { id: "whatsapp", name: "WhatsApp", count: 15600, price: 0.35, icon: SiWhatsapp },
  { id: "telegram", name: "Telegram", count: 22100, price: 0.2, icon: SiTelegram },
  { id: "instagram", name: "Instagram", count: 9800, price: 0.18, icon: SiInstagram },
  { id: "twitter", name: "Twitter/X", count: 7200, price: 0.22, icon: SiX },
  { id: "tiktok", name: "TikTok", count: 11300, price: 0.28, icon: SiTiktok },
  { id: "discord", name: "Discord", count: 6500, price: 0.12, icon: SiDiscord },
  { id: "microsoft", name: "Microsoft", count: 4200, price: 0.3, icon: FaMicrosoft },
  { id: "apple", name: "Apple", count: 3100, price: 0.45, icon: SiApple },
  { id: "amazon", name: "Amazon", count: 5600, price: 0.38, icon: SiAmazon },
  { id: "spotify", name: "Spotify", count: 8100, price: 0.15, icon: SiSpotify },
  { id: "netflix", name: "Netflix", count: 2900, price: 0.55, icon: SiNetflix },
  { id: "uber", name: "Uber", count: 4700, price: 0.25, icon: SiUber },
  { id: "paypal", name: "PayPal", count: 3800, price: 0.42, icon: SiPaypal },
];

interface ServiceListProps {
  selectedService: string | null;
  onSelectService: (id: string) => void;
  loading?: boolean;
}

const ServiceList = ({ selectedService, onSelectService, loading }: ServiceListProps) => {
  const [search, setSearch] = useState("");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-3">Select service</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Service List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                  selectedService === service.id
                    ? "bg-[hsl(200,100%,50%)] text-white"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{service.name}</p>
                  <p
                    className={cn(
                      "text-xs",
                      selectedService === service.id
                        ? "text-white/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {service.count.toLocaleString()} numbers
                  </p>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    selectedService === service.id
                      ? "text-white"
                      : "text-accent"
                  )}
                >
                  ${service.price.toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServiceList;
