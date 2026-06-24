import { useEffect, useMemo, useState } from "react";
import { Menu, Search, Package } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import ProductDetailsModal, { type ProductDetails } from "@/components/marketplace/ProductDetailsModal";

type Product = ProductDetails;

interface MarketplaceCategory {
  id: string;
  name: string;
}

interface MarketplaceCountry {
  country_code: string;
  country_name: string;
  country_flag: string;
}

interface ProductRow {
  id: string;
  title: string;
  image_url: string | null;
  price_usd: number;
  stock: number | null;
  country_code: string | null;
  description: string | null;
  delivery_items: unknown;
  marketplace_categories: { name: string } | null;
}

const MarketplacePage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [countries, setCountries] = useState<MarketplaceCountry[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      const [productsRes, categoriesRes, countriesRes] = await Promise.all([
        supabase
          .from("marketplace_products")
          .select(
            "id, title, image_url, price_usd, stock, country_code, description, delivery_items, marketplace_categories ( name )"
          )
          .order("created_at", { ascending: false }),
        supabase.from("marketplace_categories").select("id, name").order("name"),
        supabase
          .from("marketplace_country")
          .select("country_code, country_name, country_flag")
          .eq("is_active", true)
          .order("sort_order"),
      ]);

      if (cancelled) return;

      if (productsRes.error || categoriesRes.error || countriesRes.error) {
        toast({
          title: "Failed to load marketplace",
          description:
            productsRes.error?.message ??
            categoriesRes.error?.message ??
            countriesRes.error?.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const countryRows = (countriesRes.data ?? []) as MarketplaceCountry[];
      const countryByCode = new Map(
        countryRows.map((c) => [c.country_code, c])
      );

      const mapped = ((productsRes.data ?? []) as ProductRow[]).map((p) => {
        const countryInfo = p.country_code
          ? countryByCode.get(p.country_code)
          : undefined;

        const deliveryItems = Array.isArray(p.delivery_items)
          ? (p.delivery_items as unknown[]).filter(
              (x): x is string => typeof x === "string"
            )
          : [];

        return {
          id: p.id,
          title: p.title,
          image: p.image_url ?? "",
          category: p.marketplace_categories?.name ?? "Uncategorized",
          country: countryInfo?.country_name ?? p.country_code ?? "Unknown",
          countryFlag: countryInfo?.country_flag ?? "🌍",
          stock: p.stock ?? 0,
          price: Number(p.price_usd),
          description: p.description,
          deliveryItems,
        };
      });

      setProducts(mapped);
      setCategories((categoriesRes.data ?? []) as MarketplaceCategory[]);
      setCountries(countryRows);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (category !== "all" && p.category !== category) return false;
      if (country !== "all" && p.country !== country) return false;
      return true;
    });
  }, [products, query, category, country]);

  const handleBuy = (p: Product) => {
    setSelected(null);
    toast({
      title: "Coming soon",
      description: `Purchase flow for ${p.title} isn't live yet.`,
    });
  };

  const content = (
    <div className="space-y-4 lg:space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.country_code} value={c.country_name}>
                {c.country_flag} {c.country_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 flex flex-col items-center text-center">
          <Package className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No products found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {filtered.map((p) => {
            const inStock = p.stock > 0;
            return (
              <div
                key={p.id}
                className="bg-card border border-border rounded-xl overflow-hidden flex flex-col transition-shadow hover:shadow-md"
              >
                <div className="aspect-square bg-muted flex items-center justify-center text-3xl">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span aria-hidden>{p.countryFlag}</span>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      <span className="mr-1">{p.countryFlag}</span>
                      {p.country}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
                        inStock
                          ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {inStock ? `Stock ${p.stock}` : "Out of stock"}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    variant="accent"
                    size="sm"
                    className="w-full mt-1"
                    disabled={!inStock}
                    onClick={() => handleBuy(p)}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r border-border">
              <DashboardSidebar contentOnly onNavigate={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold text-foreground flex-1 text-center">
            Marketplace
          </h1>
          <div className="w-8" />
        </header>
        <main className="flex-1 p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Buy accounts, subscriptions and digital products.
          </p>
          {content}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:pl-4 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Buy accounts, subscriptions and digital products.
          </p>
        </div>
        {content}
      </main>
    </div>
  );
};

export default MarketplacePage;
