import { Button } from "@/components/ui/button";
import { Lock, TrendingDown, TrendingUp, Wallet } from "lucide-react";

const Dashboard = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left order-2 lg:order-1">
            <p className="section-label mb-3 sm:mb-4">{'{'} Analysis Dashboard {'}'}</p>
            <h2 className="section-title mb-4 sm:mb-6">
              Manage and review your income and spending.
            </h2>
            <p className="section-description mb-6 sm:mb-8">
              We help to keep track of your expenses and incomes. It shows the flow of records over a specific period of time, such as weekly, monthly or re*wly
            </p>
            <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto min-h-[44px]">
              <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
              Open An Account
            </Button>
          </div>

          {/* Right Content - Dashboard Card */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-violet-light/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-border/30">
              {/* Balance Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Wallet size={16} className="sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <span className="text-sm sm:text-base font-medium">Available Balance:</span>
                </div>
                <p className="text-lg sm:text-xl font-bold">
                  <span className="text-xs sm:text-sm align-top">$</span>8,884.00
                </p>
              </div>

              {/* Payments Section */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <p className="text-sm sm:text-base font-medium">Total Payments</p>
                  <span className="text-[10px] sm:text-xs bg-primary text-primary-foreground px-2 py-1 rounded">USD ▾</span>
                </div>

                <div className="text-center mb-4 sm:mb-6">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-1 sm:mb-2">~60%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Grow since last week</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border/50">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Income</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">90,560.00<span className="text-[10px] sm:text-xs text-muted-foreground ml-1">(USD)</span></p>
                  <p className="text-[10px] sm:text-xs text-success flex items-center gap-1">
                    <TrendingUp size={10} className="sm:w-3 sm:h-3" />
                    <span className="hidden xs:inline">60% increase compared to last week</span>
                    <span className="xs:hidden">+60% vs last week</span>
                  </p>
                </div>
                <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border/50">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Expense</p>
                  <p className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">19,760.00<span className="text-[10px] sm:text-xs text-muted-foreground ml-1">(USD)</span></p>
                  <p className="text-[10px] sm:text-xs text-destructive flex items-center gap-1">
                    <TrendingDown size={10} className="sm:w-3 sm:h-3" />
                    <span className="hidden xs:inline">40% decrease compared to last week</span>
                    <span className="xs:hidden">-40% vs last week</span>
                  </p>
                </div>
              </div>

              {/* Visual Bars */}
              <div className="flex gap-1.5 sm:gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-10 sm:w-12 md:w-14 lg:w-16 rounded-t-lg sm:rounded-t-xl ${i === 4 ? 'h-12 sm:h-14 md:h-16 bg-accent' : 'h-8 sm:h-10 md:h-12 bg-peach-dark/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;