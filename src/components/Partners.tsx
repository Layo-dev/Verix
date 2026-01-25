const Partners = () => {
  const partners = [
    { name: "GitHub", icon: "○" },
    { name: "LinkedIn", icon: "in" },
    { name: "Pipedrive", icon: "▷" },
    { name: "Slack", icon: "◉" },
    { name: "Airtable", icon: "⬡" },
    { name: "PHP", icon: "php" },
    { name: "Hotjar", icon: "⚡" },
    { name: "Figma", icon: "◎" },
  ];

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 md:mb-10">
          {'{'} We partner with the world's leading brands {'}'}
        </p>

        {/* Partner Logos */}
        <div className="grid grid-cols-4 sm:flex sm:flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-10 sm:mb-12 md:mb-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer justify-center"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border flex items-center justify-center text-[10px] sm:text-xs">
                {partner.icon}
              </span>
              <span className="text-[10px] sm:text-sm font-medium hidden sm:inline">{partner.name}</span>
            </div>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-border">
          <div className="text-center md:text-left">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
              Our partners include some of the world's leading brands
            </h3>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs sm:text-sm text-accent mb-2">✨ 4.9 {'{'}6k+Reviews{'}'} by Trustpilot</p>
            <p className="text-base sm:text-lg font-semibold text-foreground">
              The Platform stands alone as the payix customer management solution.
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="section-description">
              Most of your app is based on the data you already have, whether it lives in a Google Sheet, an Excel file, or other data sources.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;