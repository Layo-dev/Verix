import { ArrowUpRight, TrendingUp, User } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label mb-4">{'{'} Powerful Features {'}'}</p>
          <h2 className="section-title mb-6">Explore the standout features</h2>
          <p className="section-description">
            Which spokesperson is my target audience responding to. Get real-time answers to improve your creative mid-flight. And see what's worked in the past to get Intel for your next campaign
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 - Targeting */}
          <div className="card-feature group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-peach/50 flex items-center justify-center">
                <span className="text-sm font-bold">SK</span>
              </div>
              <div>
                <p className="text-sm font-medium">Sahawardi khis</p>
                <p className="text-xs text-muted-foreground">info@sahawardi.khis</p>
              </div>
              <p className="ml-auto text-sm font-bold">$659.00</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Targeting</p>
                <span className="text-xs text-success flex items-center gap-1">
                  <TrendingUp size={12} />
                  3.2%
                </span>
              </div>
              <p className="text-3xl font-bold">
                <span className="text-sm align-top">$</span>10,000
              </p>
              <p className="text-xs text-muted-foreground mt-1">4.5% vs last month</p>
            </div>

            <button className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-xl px-4 py-3 text-sm font-medium group-hover:bg-primary/90 transition-colors">
              See Details
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Card 2 - Form */}
          <div className="card-feature">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full name</label>
                <div className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg bg-muted/30">
                  <User size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">John Smith</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Company</label>
                <div className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg bg-muted/30">
                  <div className="w-4 h-4 rounded bg-foreground flex items-center justify-center">
                    <div className="w-2 h-2 bg-background rounded-sm" />
                  </div>
                  <span className="text-sm text-muted-foreground">Payix.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="text-xs text-muted-foreground mb-1 block">Total Income</label>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">
                    <span className="text-sm align-top">$</span>8,884.00
                  </p>
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <ArrowUpRight size={16} className="text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Balance */}
          <div className="card-feature relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                <p className="text-2xl font-bold">
                  <span className="text-sm align-top">$</span>9,684.00
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <ArrowUpRight size={18} />
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="h-24 relative mb-4">
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
              <p className="text-xs text-muted-foreground">Exp. Date:</p>
              <p className="text-xl font-bold">12/2024</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
