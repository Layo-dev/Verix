import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alcin Adason",
      role: "Visual Designer at Lolup",
      avatar: "AA",
      rating: 5,
      text: "\"What makes us for hire stand out is their exclusive focus on SEO recruitment and their candidate testing process prior to recommendations.\"",
    },
    {
      name: "Paul Jackson",
      role: "User Interface Designer of Janugs",
      avatar: "PJ",
      rating: 4.9,
      text: "\"Few writers can match Kotler's invigorating and insightful style. Tomorrowland is like an adrenaline rush. What makes us for hire stand out is their exclusive focus on. We help to keep track of your expenses and incomes. SEO recruitment and their candidate testing process recommendations.\"",
    },
    {
      name: "Alcin Adason",
      role: "Visual Designer at Lolup",
      avatar: "AA",
      rating: 5,
      text: "\"It's challenging to find a writer as dynamic and in-tune as Kotler. Tomorrow land is akin to a powerful caffeine boost.\"",
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
          <div className="lg:col-span-2 flex items-end justify-end">
            <p className="section-description max-w-md text-right">
              We help to keep track of your expenses and incomes. it shows
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
