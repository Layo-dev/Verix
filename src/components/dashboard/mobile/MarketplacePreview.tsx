import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

const products = [
  {
    id: "1",
    title: "Aged Instagram Account",
    meta: "USA · 12 in stock",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: "2",
    title: "Telegram Verified Account",
    meta: "Global · 8 in stock",
    price: 9.5,
    image:
      "https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=400&q=60",
  },
];

const MarketplacePreview = () => {
  return (
    <section>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">Explore Marketplace</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Digital products and tools for your online business.
          </p>
        </div>
        <Link
          to="/dashboard/products"
          className="text-xs font-semibold text-accent shrink-0 inline-flex items-center gap-0.5"
        >
          View
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <Link
            key={product.id}
            to="/dashboard/products"
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">{product.title}</p>
              <p className="text-xs text-muted-foreground truncate">{product.meta}</p>
            </div>
            <span className="text-sm font-extrabold text-accent shrink-0">
              ${product.price.toFixed(2)}
            </span>
          </Link>
        ))}
      </div>

      <Link
        to="/dashboard/products"
        className="mt-3 flex items-center justify-center rounded-full border border-border bg-muted py-2.5 text-sm font-semibold text-foreground"
      >
        View marketplace
      </Link>
    </section>
  );
};

export default MarketplacePreview;
