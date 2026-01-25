import { ArrowUpRight, Edit, Wallet } from "lucide-react";

const PhoneMockup = () => {
  return (
    <div className="relative animate-float">
      {/* Phone Frame */}
      <div className="relative bg-foreground rounded-[3rem] p-3 shadow-2xl">
        <div className="bg-background rounded-[2.5rem] overflow-hidden w-72 md:w-80">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-background">
            <span className="text-sm font-medium">9:41</span>
            <div className="w-20 h-6 bg-foreground rounded-full" />
            <div className="flex items-center gap-1">
              <div className="w-4 h-3 flex gap-[1px]">
                <div className="w-[3px] h-1 bg-foreground rounded-sm self-end" />
                <div className="w-[3px] h-2 bg-foreground rounded-sm self-end" />
                <div className="w-[3px] h-2.5 bg-foreground rounded-sm self-end" />
                <div className="w-[3px] h-3 bg-foreground rounded-sm" />
              </div>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"/>
              </svg>
              <div className="w-6 h-3 bg-foreground rounded-sm flex items-center justify-end pr-0.5">
                <div className="w-4 h-2 bg-success rounded-sm" />
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="px-5 pb-6 space-y-4">
            {/* Balance Card */}
            <div className="bg-muted/50 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">
                  <span className="text-sm align-top">$</span>4,4089
                </p>
                <button className="flex items-center gap-1 text-xs bg-background rounded-full px-3 py-1.5 border border-border">
                  <Edit size={12} />
                  Edit
                </button>
              </div>
            </div>

            {/* Action Tabs */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full py-2.5 text-sm font-medium">
                <Wallet size={14} />
                Payout
              </button>
              <button className="flex-1 text-center py-2.5 text-sm text-muted-foreground">
                Card
              </button>
              <button className="flex-1 text-center py-2.5 text-sm text-muted-foreground">
                Bank
              </button>
            </div>

            {/* Payout Card */}
            <div className="bg-muted/50 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Payout</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">
                  <span className="text-sm align-top">$</span>1,469
                </p>
                <button className="flex items-center gap-1 text-xs text-accent border border-accent/30 bg-accent/10 rounded-full px-3 py-1.5">
                  Get Paid
                </button>
              </div>
            </div>

            {/* User Row */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-peach flex items-center justify-center text-sm font-semibold">
                SK
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sahawardi khis</p>
              </div>
              <p className="text-sm font-bold">$12.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stats Card - Hidden on small mobile to prevent overflow */}
      <div className="absolute -bottom-8 left-0 md:-left-12 bg-card rounded-2xl p-3 md:p-4 shadow-xl border border-border/50 animate-fade-in hidden sm:block max-w-[280px] md:max-w-none">
        <div className="flex gap-4 md:gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Income</p>
            <p className="text-sm md:text-lg font-bold">90,560.00<span className="text-xs text-muted-foreground ml-1">(USD)</span></p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <ArrowUpRight size={12} />
              60% increase
            </p>
          </div>
          <div className="border-l border-border pl-4 md:pl-6">
            <p className="text-xs text-muted-foreground mb-1">Total Expense</p>
            <p className="text-sm md:text-lg font-bold">19,760.00<span className="text-xs text-muted-foreground ml-1">(USD)</span></p>
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <ArrowUpRight size={12} className="rotate-90" />
              40% decrease
            </p>
          </div>
        </div>
      </div>

      {/* User Card - Hidden on small mobile to prevent overflow */}
      <div className="absolute -bottom-20 right-0 bg-card rounded-xl p-2 md:p-3 shadow-lg border border-border/50 hidden sm:flex items-center gap-2 md:gap-3 max-w-[240px] md:max-w-none">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs md:text-sm font-semibold flex-shrink-0">
          HE
        </div>
        <div className="min-w-0">
          <p className="text-xs md:text-sm font-medium truncate">Hawardi Elia</p>
          <p className="text-xs text-muted-foreground truncate">info@hawardielia.au</p>
        </div>
        <p className="text-xs md:text-sm font-bold ml-2 md:ml-4 flex-shrink-0">$489.00</p>
      </div>
    </div>
  );
};

export default PhoneMockup;
