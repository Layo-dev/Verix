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
    <section className="py-16 md:py-20 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-10">
          {'{'} We partner with the world's leading brands {'}'}
        </p>

        {/* Partner Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-xs">
                {partner.icon}
              </span>
              <span className="text-sm font-medium hidden md:inline">{partner.name}</span>
            </div>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-border">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Our partners include some of the world's leading brands
            </h3>
          </div>
          <div>
            <p className="text-sm text-accent mb-2">✨ 4.9 {'{'}6k+Reviews{'}'} by Trustpilot</p>
            <p className="text-lg font-semibold text-foreground">
              The Platform stands alone as the payix customer management solution.
            </p>
          </div>
          <div>
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
