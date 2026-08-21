import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileHeader from "@/components/dashboard/mobile/MobileHeader";
import BottomNav from "@/components/dashboard/mobile/BottomNav";
import BalanceCard from "@/components/dashboard/mobile/BalanceCard";
import RecentActivity from "@/components/dashboard/mobile/RecentActivity";
import TopUpModal from "@/components/dashboard/TopUpModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileBalance } from "@/hooks/useProfileBalance";

const WalletPage = () => {
  const isMobile = useIsMobile();
  const { data: balance = 0 } = useProfileBalance();
  const [topUpOpen, setTopUpOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <MobileHeader title="Wallet" />
        <main className="px-4 pt-4 pb-28 space-y-6">
          <BalanceCard />
          <RecentActivity />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:pl-4 overflow-x-hidden">
        <h1 className="text-2xl font-bold text-foreground mb-6">Wallet</h1>
        <div className="max-w-md rounded-3xl border border-border bg-surface p-6">
          <p className="text-sm font-medium text-muted-foreground">Available balance</p>
          <p className="mt-1 text-4xl font-extrabold text-foreground">${balance.toFixed(2)}</p>
          <button
            onClick={() => setTopUpOpen(true)}
            className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Fund wallet
          </button>
        </div>
        <TopUpModal open={topUpOpen} onOpenChange={setTopUpOpen} />
      </main>
    </div>
  );
};

export default WalletPage;
