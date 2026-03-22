import { SiInstagram, SiFacebook, SiWhatsapp, SiX, SiTelegram, SiTiktok } from "react-icons/si";

const services = [
  { name: "Instagram", icon: SiInstagram, code: "502 567", color: "text-pink-500" },
  { name: "Facebook", icon: SiFacebook, code: "839 412", color: "text-blue-600" },
  { name: "WhatsApp", icon: SiWhatsapp, code: "714 295", color: "text-green-500" },
  { name: "Twitter / X", icon: SiX, code: "628 103", color: "text-foreground" },
  { name: "Telegram", icon: SiTelegram, code: "951 384", color: "text-sky-500" },
  { name: "TikTok", icon: SiTiktok, code: "467 820", color: "text-foreground" },
];

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label mb-4">{'{'} Powerful Features {'}'}</p>
          <h2 className="section-title mb-6">Receive SMS with codes online directly on our website</h2>
          <p className="section-description">
            Receive SMS with codes online directly on our website.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.name} className="card-feature group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-peach/50 flex items-center justify-center">
                  <service.icon size={20} className={service.color} />
                </div>
                <div>
                  <h3 className="text-md font-semibold">{service.name}</h3>
                  <p className="text-sm text-foreground">{service.code} is your {service.name.toLowerCase()} code for verification</p>
                  <p className="text-xs text-muted-foreground">Do not share this code with anyone</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
