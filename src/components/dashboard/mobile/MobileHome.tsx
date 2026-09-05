import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";
import BalanceCard from "./BalanceCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import ExploreMarketplace from "./ExploreMarketplace";

const MobileHome = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <MobileHeader />

      <main className="px-4 pt-4 pb-28 space-y-6">
        <BalanceCard transactions={24} />
        <QuickActions />
        <RecentActivity />
        <ExploreMarketplace />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default MobileHome;
