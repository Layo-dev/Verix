import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  time: string;
}

const items: ActivityItem[] = [
  { id: "1", title: "Number purchased", subtitle: "Canada · WhatsApp", amount: -0.61, time: "2m" },
  { id: "2", title: "Wallet funded", subtitle: "Paystack", amount: 10, time: "1h" },
  { id: "3", title: "Number purchased", subtitle: "USA · Telegram", amount: -0.29, time: "3h" },
];

const RecentActivity = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
        <Link to="/dashboard/history" className="text-xs font-semibold text-accent">
          View all
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border">
        {items.map((item) => {
          const positive = item.amount > 0;
          return (
            <div key={item.id} className="flex items-center gap-3 p-4">
              <span
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  positive ? "bg-[hsl(var(--success))]" : "bg-accent"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={cn(
                    "text-sm font-bold",
                    positive ? "text-[hsl(var(--success))]" : "text-foreground"
                  )}
                >
                  {positive ? "+" : "-"}${Math.abs(item.amount).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentActivity;
