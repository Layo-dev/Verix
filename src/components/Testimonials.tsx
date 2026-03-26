import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alcin Adason",
      role: "Crypto Trader",
      avatar: "AA",
      rating: 5,
      text: "\"As a crypto trader, I need reliable tools that protect my privacy while keeping me agile across multiple exchanges. Verix has been a huge asset its virtual number service makes account verification simple, secure, and stress-free.\"",
    },
    {
      name: "Paul Jackson",
      role: "Digital Marketer",
      avatar: "PJ",
      rating: 4.9,
      text: "\"Managing multiple client campaigns means I’m constantly signing up for new platforms, ad accounts, and analytics tools. Verix has been a lifesaver—its virtual number service lets me verify accounts quickly without juggling dozens of personal SIM cards.\"",
    },
    {
      name: "Alcin Adason",
      role: "Freelancer",
      avatar: "AA",
      rating: 5,
      text: "\"Working with clients worldwide requires me to sign up for countless collaboration tools. Verix gives me a dedicated virtual number that keeps my work life separate from my personal life. It’s simple, reliable, and helps me maintain professionalism across borders.\"",
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <p className="section-label mb-4">{'{'} Client words {'}'}</p>
            <h2 className="section-title">
              Customer words about their experiences
            </h2>
          </div>
          <div className="bg-accent/10 lg:col-span-2 flex items-end justify-end">
            <p className="section-description max-w-md text-right">
              Verix makes the process seamless and efficient. It’s a tool I can’t imagine working without.
            </p>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                Trusted Partner
              </p>

              <p className="text-foreground leading-relaxed mb-6">
                {testimonial.text}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-peach flex items-center justify-center text-sm font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                {testimonial.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{testimonial.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-12 max-w-md">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-foreground rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
