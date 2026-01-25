import { Button } from "@/components/ui/button";
import { Lock, TrendingDown, TrendingUp, Wallet } from "lucide-react";

const Dashboard = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="max-w-lg">
            <p className="section-label mb-4">{'{'} Analysis Dashboard {'}'}</p>
            <h2 className="section-title mb-6">
              Manage and review your income and spending.
            </h2>
            <p className="section-description mb-8">
              We help to keep track of your expenses and incomes. It shows the flow of records over a specific period of time, such as weekly, monthly or re*wly
            </p>
            <Button variant="hero" size="lg" className="gap-2">
              <Lock size={18} />
              Open An Account
            </Button>
          </div>

          {/* Right Content - Dashboard Card */}
          <div className="relative">
            <div className="bg-violet-light/50 rounded-3xl p-6 md:p-8 border border-border/30">
              {/* Balance Header */}
              <div className="flex items-center justify-between mb-6 bg-card rounded-xl p-4 shadow-sm border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Wallet size={20} className="text-accent" />
                  </div>
                  <span className="font-medium">Available Balance:</span>
                </div>
                <p className="text-xl font-bold">
                  <span className="text-sm align-top">$</span>8,884.00
                </p>
              </div>

              {/* Payments Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-medium">Total Payments</p>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">USD ▾</span>
                </div>

                <div className="text-center mb-6">
                  <p className="text-5xl font-bold text-accent mb-2">~60%</p>
                  <p className="text-sm text-muted-foreground">Grow since last week</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-card rounded-xl p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Income</p>
                  <p className="text-xl font-bold mb-2">90,560.00<span className="text-xs text-muted-foreground ml-1">(USD)</span></p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp size={12} />
                    60% increase compared to last week
                  </p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Total Expense</p>
                  <p className="text-xl font-bold mb-2">19,760.00<span className="text-xs text-muted-foreground ml-1">(USD)</span></p>
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <TrendingDown size={12} />
                    40% decrease compared to last week
                  </p>
                </div>
              </div>

              {/* Visual Bars */}
              <div className="flex gap-1 sm:gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-10 sm:w-14 md:w-16 rounded-t-xl ${i === 4 ? 'h-16 bg-accent' : 'h-12 bg-peach-dark/50'}`}
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
