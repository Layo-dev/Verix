import { ArrowUpRight, TrendingUp, User } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16">
          <p className="section-label mb-3 sm:mb-4">{'{'} Powerful Features {'}'}</p>
          <h2 className="section-title mb-4 sm:mb-6">Explore the standout features</h2>
          <p className="section-description px-2">
            Which spokesperson is my target audience responding to. Get real-time answers to improve your creative mid-flight. And see what's worked in the past to get Intel for your next campaign
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Card 1 - Targeting */}
          <div className="card-feature group">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent/20 to-peach/50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold">SK</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">Sahawardi khis</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">info@sahawardi.khis</p>
              </div>
              <p className="text-xs sm:text-sm font-bold flex-shrink-0">$659.00</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">Targeting</p>
                <span className="text-[10px] sm:text-xs text-success flex items-center gap-1">
                  <TrendingUp size={10} className="sm:w-3 sm:h-3" />
                  3.2%
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                <span className="text-xs sm:text-sm align-top">$</span>10,000
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">4.5% vs last month</p>
            </div>

            <button className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium group-hover:bg-primary/90 transition-colors min-h-[44px]">
              See Details
              <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Card 2 - Form */}
          <div className="card-feature">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">Full name</label>
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 border border-border rounded-lg bg-muted/30">
                  <User size={12} className="sm:w-3.5 sm:h-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground truncate">John Smith</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">Company</label>
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 border border-border rounded-lg bg-muted/30">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-foreground flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-background rounded-sm" />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">Payix.</span>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-border">
                <label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">Total Income</label>
                <div className="flex items-center justify-between">
                  <p className="text-xl sm:text-2xl font-bold">
                    <span className="text-xs sm:text-sm align-top">$</span>8,884.00
                  </p>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <ArrowUpRight size={14} className="sm:w-4 sm:h-4 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Balance */}
          <div className="card-feature relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Available Balance</p>
                <p className="text-xl sm:text-2xl font-bold">
                  <span className="text-xs sm:text-sm align-top">$</span>9,684.00
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center">
                <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="h-16 sm:h-24 relative mb-3 sm:mb-4">
              <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                <path
                  d="M0,60 Q20,55 40,50 T80,35 T120,40 T160,20 T200,10"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Exp. Date:</p>
              <p className="text-lg sm:text-xl font-bold">12/2024</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;