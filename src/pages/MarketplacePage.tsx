import { useMemo, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  country: string;
  countryFlag: string;
  stock: number;
  price: number;
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", title: "Netflix Premium", image: "", category: "Streaming", country: "United States", countryFlag: "🇺🇸", stock: 12, price: 3.0 },
  { id: "2", title: "Spotify Family", image: "", category: "Streaming", country: "United Kingdom", countryFlag: "🇬🇧", stock: 8, price: 2.5 },
  { id: "3", title: "Disney+ Standard", image: "", category: "Streaming", country: "Canada", countryFlag: "🇨🇦", stock: 5, price: 2.75 },
  { id: "4", title: "Telegram Premium", image: "", category: "Social", country: "Nigeria", countryFlag: "🇳🇬", stock: 20, price: 1.5 },
  { id: "5", title: "Instagram Aged", image: "", category: "Social", country: "United States", countryFlag: "🇺🇸", stock: 0, price: 4.0 },
  { id: "6", title: "X Premium", image: "", category: "Social", country: "United Kingdom", countryFlag: "🇬🇧", stock: 15, price: 3.25 },
  { id: "7", title: "Steam Wallet $10", image: "", category: "Gaming", country: "United States", countryFlag: "🇺🇸", stock: 30, price: 9.5 },
  { id: "8", title: "PlayStation Plus", image: "", category: "Gaming", country: "Canada", countryFlag: "🇨🇦", stock: 6, price: 7.0 },
  { id: "9", title: "ChatGPT Plus", image: "", category: "Productivity", country: "United States", countryFlag: "🇺🇸", stock: 10, price: 12.0 },
  { id: "10", title: "Notion Pro", image: "", category: "Productivity", country: "Germany", countryFlag: "🇩🇪", stock: 4, price: 5.0 },
  { id: "11", title: "Canva Pro", image: "", category: "Productivity", country: "Nigeria", countryFlag: "🇳🇬", stock: 18, price: 3.5 },
  { id: "12", title: "YouTube Premium", image: "", category: "Streaming", country: "Germany", countryFlag: "🇩🇪", stock: 9, price: 2.99 },
];

const MarketplacePage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category))).sort(),
    []
  );
  const countries = useMemo(
    () => Array.from(new Set(MOCK_PRODUCTS.map((p) => p.country))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (category !== "all" && p.category !== category) return false;
      if (country !== "all" && p.country !== country) return false;
      return true;
    });
  }, [query, category, country]);

  const handleBuy = (p: Product) => {
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
              <SelectItem key={c} value={c}>
                {c}
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
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
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
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
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
