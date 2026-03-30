const Stats = () => {
  const stats = [
    { value: "10+", label: "Services Available" },
    { value: "100+", label: "Countries Available" },
    { value: "15+", label: "Satisfied Customer" },
  ];

  return (
    <section className="py-10 md:py-12 border-y border-border bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left Text */}
          <div className="flex items-center gap-4 md:max-w-sm">
            <div className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center">
              <div className="w-3 h-3 rounded-full border-2 border-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground">
            Global coverage - 180+ countries
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
