import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    title: "Social Account",
    description: "Ready-to-use verified social profile.",
    price: "$12.00",
    image:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    alt: "Social media apps on a smartphone screen",
  },
  {
    title: "Instagram Account",
    description: "Aged account with clean history.",
    price: "$8.50",
    image:
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=800&q=80",
    alt: "Instagram app open on a phone held in a hand",
  },
  {
    title: "Digital Tool",
    description: "Premium software access for your workflow.",
    price: "$15.00",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    alt: "Laptop with productivity software on a desk",
  },
  {
    title: "Telegram Number",
    description: "Instant number for messaging apps.",
    price: "$6.00",
    image:
      "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=800&q=80",
    alt: "Telegram messaging app on a mobile device",
  },
];

const Marketplace = () => {
  return (
    <section id="marketplace" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="marketplace-panel relative overflow-hidden rounded-3xl border border-border p-6 sm:p-10 lg:p-14">
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-label-caps mb-4">Verix Marketplace</p>
              <h2 className="section-title mb-5">
                More than verification. Your digital marketplace.
              </h2>
              <p className="section-description">
                Discover ready-to-use digital products, accounts and tools built
                for people running businesses online.
              </p>
            </div>
            <Link
              to="/dashboard/products"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
            >
              Explore Marketplace
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.title}
                to="/dashboard/products"
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent/40"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-foreground">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-foreground">
                      {product.price}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                      Buy
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
