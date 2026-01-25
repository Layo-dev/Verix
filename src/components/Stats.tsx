const Stats = () => {
  const stats = [
    { value: "160+", label: "Beneficial Cashback" },
    { value: "1.8M", label: "Satisfied Customer" },
    { value: "196+", label: "County Available" },
  ];

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-20 border-y border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
          {/* Left Text */}
          <div className="flex items-center gap-3 sm:gap-4 lg:max-w-sm text-center lg:text-left">
            <div className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-foreground items-center justify-center flex-shrink-0">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-foreground" />
            </div>
            <p className="text-base sm:text-lg font-semibold text-foreground">
              Powered and supported by leading international financial services
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16 w-full lg:w-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;