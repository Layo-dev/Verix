import { useState } from "react";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CountryItem } from "@/hooks/usePricing";

interface CountryListProps {
  selectedCountry: string | null;
  onSelectCountry: (code: string) => void;
  countries: CountryItem[];
  loading?: boolean;
}

const CountryList = ({ selectedCountry, onSelectCountry, countries, loading }: CountryListProps) => {
  const [search, setSearch] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.phoneCode.includes(search)
  );

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-3">Buy a number</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))
            : filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => onSelectCountry(country.code)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    selectedCountry === country.code
                      ? "bg-[hsl(200,100%,50%)] text-white"
                      : "hover:bg-muted"
                  )}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1 text-sm font-medium">{country.name}</span>
                  <span
                    className={cn(
                      "text-xs",
                      selectedCountry === country.code
                        ? "text-white/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {country.phoneCode}
                  </span>
                </button>
              ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CountryList;
