import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Call02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useProfileBalance } from "@/hooks/useProfileBalance";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import TopUpModal from "../TopUpModal";

const BalanceCard = () => {
  const { data: balance = 0 } = useProfileBalance();
  const { user } = useAuth();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const navigate = useNavigate();
  const { data: transactionCount, isLoading: transactionsLoading } = useQuery({
    queryKey: ["wallet-transaction-count", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("wallet_transactions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);

      if (error) throw error;
      return count ?? 0;
    },
  });

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
          <p className="text-xl font-bold text-foreground mt-1">
            {transactionsLoading ? "..." : transactionCount ?? 0}
          </p>
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
