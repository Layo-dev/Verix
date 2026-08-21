import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";
import BalanceCard from "./BalanceCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import MarketplacePreview from "./MarketplacePreview";

const MobileHome = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <MobileHeader />

      <main className="px-4 pt-4 pb-28 space-y-6">
        <BalanceCard transactions={24} />
        <QuickActions />
        <RecentActivity />
        <MarketplacePreview />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MobileHome;
