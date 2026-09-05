import { useEffect, useState } from "react";
import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface MarketplaceProduct {
  id: string;
  title: string;
  image_url: string | null;
  price_usd: number;
  stock: number | null;
}

const ExploreMarketplace = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      const { data } = await supabase
        .from("marketplace_products")
        .select("id, title, image_url, price_usd, stock")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!cancelled) {
        setProducts((data ?? []) as MarketplaceProduct[]);
        setLoading(false);
      }
    };

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="explore-marketplace-heading">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2
            id="explore-marketplace-heading"
            className="text-sm font-semibold text-foreground"
          >
            Explore Marketplace
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Fresh picks, ready when you are.
          </p>
        </div>
        <Link
          to="/dashboard/products"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border border-border bg-card">
              <Skeleton className="aspect-[1.2] w-full rounded-none" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to="/dashboard/products"
              className="overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-sm"
            >
              <div className="flex aspect-[1.2] items-center justify-center bg-muted">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-foreground">{product.title}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-accent">
                    ${Number(product.price_usd).toFixed(2)}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {product.stock && product.stock > 0 ? `${product.stock} left` : "Available"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default ExploreMarketplace;