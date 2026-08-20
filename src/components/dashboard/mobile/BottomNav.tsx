import { Link, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Message01Icon,
  InboxIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/dashboard", icon: Home01Icon },
  { label: "Receive", href: "/dashboard/buy", icon: Message01Icon },
  { label: "Inbox", href: "/dashboard/referral", icon: InboxIcon },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet01Icon },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-accent" : "text-muted-foreground"
                )}
              >
                <HugeiconsIcon icon={item.icon} size={22} strokeWidth={active ? 2 : 1.6} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
