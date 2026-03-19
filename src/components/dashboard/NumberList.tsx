import { useState, useEffect } from "react";
import { Search, Phone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PurchasedNumber {
  id: string;
  phone_number: string;
  country_code: string;
  country_flag: string;
  service_name: string;
  status: "active" | "expiring" | "expired";
  expires_at: string;
  created_at: string;
}

interface NumberListProps {
  numbers: PurchasedNumber[];
  selectedNumberId: string | null;
  onSelectNumber: (id: string) => void;
}

const useCountdown = (expiresAt: string) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) return "Expired";
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
};

const NumberCard = ({
  number,
  isSelected,
  onClick,
}: {
  number: PurchasedNumber;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const timeLeft = useCountdown(number.expires_at);
  const isExpiring = number.status === "expiring" || (number.status === "active" && timeLeft !== "Expired" && parseInt(timeLeft) <= 2);

  const statusColor = number.status === "expired" || timeLeft === "Expired"
    ? "bg-muted-foreground"
    : isExpiring
    ? "bg-yellow-500"
    : "bg-[hsl(var(--success))]";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200",
        isSelected
          ? "bg-accent/10 border border-accent/30 shadow-sm"
          : "hover:bg-muted border border-transparent"
      )}
    >
      <span className="text-xl">{number.country_flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          {number.phone_number}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded-md">
            {number.service_name}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", statusColor)} />
          <span className="text-[11px] text-muted-foreground capitalize">
            {timeLeft === "Expired" ? "Expired" : number.status}
          </span>
        </div>
        {timeLeft !== "Expired" && (
          <span className="text-[11px] font-mono text-muted-foreground">{timeLeft}</span>
        )}
      </div>
    </button>
  );
};

const NumberList = ({ numbers, selectedNumberId, onSelectNumber }: NumberListProps) => {
  const [search, setSearch] = useState("");

  const filtered = numbers.filter(
    (n) =>
      n.phone_number.includes(search) ||
      n.service_name.toLowerCase().includes(search.toLowerCase()) ||
      n.country_flag.includes(search)
  );

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">Active Numbers</h2>
          <span className="ml-auto text-xs text-muted-foreground">{numbers.length}</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search numbers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-input bg-background text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Phone className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No active numbers</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Purchase a number to get started</p>
            </div>
          ) : (
            filtered.map((number) => (
              <NumberCard
                key={number.id}
                number={number}
                isSelected={selectedNumberId === number.id}
                onClick={() => onSelectNumber(number.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NumberList;
