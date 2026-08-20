import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Call02Icon,
  Message01Icon,
  ShoppingBag01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";

const actions = [
  { label: "Buy Number", icon: Call02Icon, href: "/dashboard/buy" },
  { label: "SMS Inbox", icon: Message01Icon, href: "/dashboard/referral" },
  { label: "Marketplace", icon: ShoppingBag01Icon, href: "/dashboard/products" },
  { label: "More", icon: MoreHorizontalIcon, href: "/dashboard/history" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-sm font-semibold text-foreground mb-3">Quick actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.href)}
            className="rounded-2xl border border-border bg-card p-4 text-left active:scale-[0.98] transition-transform"
          >
            <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <HugeiconsIcon icon={action.icon} size={20} />
            </span>
            <span className="mt-3 block text-sm font-semibold text-foreground">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
