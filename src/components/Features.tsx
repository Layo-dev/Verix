import { SiInstagram } from "react-icons/si";

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
          {/* Card 1 - Targeting */}
          <div className="card-feature group">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-peach/50 flex items-center justify-center">
                <SiInstagram size={20} />
              </div>
              <div>
                <h3 className="text-md font-semibold">Instagram</h3>
                <p className="text-bold">502 567 is your instagram code for verification</p>
                <p className="text-xs text-muted-foreground">Do not share this code with anyone</p>
              </div>

            </div>
          </div>

          {/* Card 2 - Form */}
          <div className="card-feature">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-peach/50 flex items-center justify-center">
                <span className="text-sm font-bold">SK</span>
              </div>
              <div>
                <h3 className="text-md font-semibold">Facebook</h3>
                <p className="text-bold">502 567 is your facebook code for verification</p>
                <p className="text-xs text-muted-foreground">Do not share this code with anyone</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Balance */}
          <div className="card-feature relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
             <div>
                <h3 className="text-md font-semibold">Instagram</h3>
                <p className="text-bold">502 567 is your instagram code for verification</p>
                <p className="text-xs text-muted-foreground">Do not share this code with anyone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
