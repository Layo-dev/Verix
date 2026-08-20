import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Call02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useProfileBalance } from "@/hooks/useProfileBalance";
import TopUpModal from "../TopUpModal";

interface BalanceCardProps {
  transactions?: number;
}

const BalanceCard = ({ transactions = 0 }: BalanceCardProps) => {
  const { data: balance = 0 } = useProfileBalance();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-surface border border-border p-5 overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">Available balance</p>
          <p className="text-3xl font-extrabold text-foreground mt-1 truncate">
            ${balance.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Frozen $0.00</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-medium text-muted-foreground">Transactions</p>
          <p className="text-xl font-bold text-foreground mt-1">{transactions}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={() => setTopUpOpen(true)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold py-2.5"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          Fund
        </button>
        <button
          onClick={() => navigate("/dashboard/buy")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-muted text-foreground text-sm font-semibold py-2.5 border border-border"
        >
          <HugeiconsIcon icon={Call02Icon} size={16} />
          Numbers
        </button>
        <button
          onClick={() => navigate("/dashboard/history")}
          className="inline-flex items-center justify-center gap-1 rounded-full bg-muted text-foreground text-sm font-semibold py-2.5 px-4 border border-border"
        >
          View
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </button>
      </div>

      <TopUpModal open={topUpOpen} onOpenChange={setTopUpOpen} />
    </div>
  );
};

export default BalanceCard;
