const Partners = () => {
  const partners = [
    { name: "Twilio", icon: "T" },
    { name: "HeroSms", icon: "H" },
    { name: "5SIM", icon: "5" },
    { name: "RentCode", icon: "R" },
    { name: "Onlinesim", icon: "O" },
    { name: "TextNow", icon: "T" },
    { name: "Dingtone", icon: "D" },
    { name: "GoogleVoice", icon: "G" },
  ];

  return (
    <section className="py-8 md:py-8 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <p className="text-center text-sm text-accent mb-10">
          {'{'} We partner with the world's leading brands {'}'}
        </p>

        {/* Partner Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-foreground hover:text-foreground transition-colors cursor-pointer"
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
            <p className="text-lg font-semibold text-foreground">
              Platform for receiving SMS with codes online directly on website.
            </p>
          </div>
          <div>
            <p className="section-description">
              Verix is a platform that allows you to receive SMS with codes online directly on our website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
