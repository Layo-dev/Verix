import { ArrowUpRight, Edit, Wallet } from "lucide-react";

const PhoneMockup = () => {
  return (
    <div className="relative animate-float">
      {/* Phone Frame */}
      <div className="relative bg-foreground rounded-[2rem] sm:rounded-[3rem] p-2 sm:p-3 shadow-2xl">
        <div className="bg-background rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden w-56 sm:w-64 md:w-72 lg:w-80">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 bg-background">
            <span className="text-xs sm:text-sm font-medium">9:41</span>
            <div className="w-14 sm:w-20 h-5 sm:h-6 bg-foreground rounded-full" />
            <div className="flex items-center gap-1">
              <div className="w-3 sm:w-4 h-2.5 sm:h-3 flex gap-[1px]">
                <div className="w-[2px] sm:w-[3px] h-0.5 sm:h-1 bg-foreground rounded-sm self-end" />
                <div className="w-[2px] sm:w-[3px] h-1 sm:h-2 bg-foreground rounded-sm self-end" />
                <div className="w-[2px] sm:w-[3px] h-1.5 sm:h-2.5 bg-foreground rounded-sm self-end" />
                <div className="w-[2px] sm:w-[3px] h-2.5 sm:h-3 bg-foreground rounded-sm" />
              </div>
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z"/>
              </svg>
              <div className="w-5 sm:w-6 h-2.5 sm:h-3 bg-foreground rounded-sm flex items-center justify-end pr-0.5">
                <div className="w-3 sm:w-4 h-1.5 sm:h-2 bg-success rounded-sm" />
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className="px-3 sm:px-5 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            {/* Balance Card */}
            <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Balance</p>
              <div className="flex items-center justify-between">
                <p className="text-lg sm:text-2xl font-bold">
                  <span className="text-xs sm:text-sm align-top">$</span>4,4089
                </p>
                <button className="flex items-center gap-1 text-[10px] sm:text-xs bg-background rounded-full px-2 sm:px-3 py-1 sm:py-1.5 border border-border">
                  <Edit size={10} className="sm:w-3 sm:h-3" />
                  Edit
                </button>
              </div>
            </div>

            {/* Action Tabs */}
            <div className="flex gap-1 sm:gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-primary text-primary-foreground rounded-full py-2 sm:py-2.5 text-xs sm:text-sm font-medium">
                <Wallet size={12} className="sm:w-3.5 sm:h-3.5" />
                Payout
              </button>
              <button className="flex-1 text-center py-2 sm:py-2.5 text-xs sm:text-sm text-muted-foreground">
                Card
              </button>
              <button className="flex-1 text-center py-2 sm:py-2.5 text-xs sm:text-sm text-muted-foreground">
                Bank
              </button>
            </div>

            {/* Payout Card */}
            <div className="bg-muted/50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Payout</p>
              <div className="flex items-center justify-between">
                <p className="text-base sm:text-xl font-bold">
                  <span className="text-xs sm:text-sm align-top">$</span>1,469
                </p>
                <button className="flex items-center gap-1 text-[10px] sm:text-xs text-accent border border-accent/30 bg-accent/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                  Get Paid
                </button>
              </div>
            </div>

            {/* User Row */}
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg sm:rounded-xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent/30 to-peach flex items-center justify-center text-xs sm:text-sm font-semibold">
                SK
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">Sahawardi khis</p>
              </div>
              <p className="text-xs sm:text-sm font-bold">$12.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Stats Card - Hidden on mobile, repositioned on tablet */}
      <div className="hidden sm:block absolute -bottom-8 -left-4 md:-left-12 bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl border border-border/50 animate-fade-in max-w-[280px] md:max-w-none">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
          <div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Income</p>
            <p className="text-sm sm:text-lg font-bold">90,560.00<span className="text-[10px] sm:text-xs text-muted-foreground ml-1">(USD)</span></p>
            <p className="text-[10px] sm:text-xs text-success flex items-center gap-1 mt-1">
              <ArrowUpRight size={10} className="sm:w-3 sm:h-3" />
              <span className="hidden md:inline">60% increase compared to last week</span>
              <span className="md:hidden">+60%</span>
            </p>
          </div>
          <div className="border-t sm:border-t-0 sm:border-l border-border pt-3 sm:pt-0 sm:pl-6">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Expense</p>
            <p className="text-sm sm:text-lg font-bold">19,760.00<span className="text-[10px] sm:text-xs text-muted-foreground ml-1">(USD)</span></p>
            <p className="text-[10px] sm:text-xs text-destructive flex items-center gap-1 mt-1">
              <ArrowUpRight size={10} className="sm:w-3 sm:h-3 rotate-90" />
              <span className="hidden md:inline">40% decrease compared to last week</span>
              <span className="md:hidden">-40%</span>
            </p>
          </div>
        </div>
      </div>

      {/* User Card - Hidden on mobile */}
      <div className="hidden md:flex absolute -bottom-20 right-0 md:right-4 bg-card rounded-xl p-3 shadow-lg border border-border/50 items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
          HE
        </div>
        <div>
          <p className="text-sm font-medium">Hawardi Elia</p>
          <p className="text-xs text-muted-foreground">info@hawardielia.au</p>
        </div>
        <p className="text-sm font-bold ml-4">$489.00</p>
      </div>
    </div>
  );
};

export default PhoneMockup;