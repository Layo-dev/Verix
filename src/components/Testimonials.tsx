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
    <section id="testimonials" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          <div className="lg:col-span-1 text-center lg:text-left">
            <p className="section-label mb-3 sm:mb-4">{'{'} Client words {'}'}</p>
            <h2 className="section-title">
              Customer words about their experiences
            </h2>
          </div>
          <div className="lg:col-span-2 flex items-end justify-center lg:justify-end">
            <p className="section-description max-w-md text-center lg:text-right">
              We help to keep track of your expenses and incomes. it shows
            </p>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-border hover:shadow-lg transition-shadow ${
                index === 1 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mb-3 sm:mb-4">
                Trusted Partner
              </p>

              <p className="text-sm sm:text-base text-foreground leading-relaxed mb-4 sm:mb-6 line-clamp-4 sm:line-clamp-none">
                {testimonial.text}
              </p>

              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent/30 to-peach flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">{testimonial.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{testimonial.role}</p>
                  </div>
                </div>
                {testimonial.rating && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star size={12} className="sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">{testimonial.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 sm:mt-10 md:mt-12 max-w-md mx-auto lg:mx-0">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-foreground rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;