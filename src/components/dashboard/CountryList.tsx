import { useState } from "react";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const countries = [
  { code: "RU", name: "Russia", flag: "🇷🇺", phoneCode: "+7" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", phoneCode: "+380" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿", phoneCode: "+7" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", phoneCode: "+62" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", phoneCode: "+60" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", phoneCode: "+254" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲", phoneCode: "+95" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", phoneCode: "+63" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", phoneCode: "+84" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", phoneCode: "+66" },
  { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44" },
  { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1" },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1" },
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33" },
];

interface CountryListProps {
  selectedCountry: string | null;
  onSelectCountry: (code: string) => void;
}

const CountryList = ({ selectedCountry, onSelectCountry }: CountryListProps) => {
  const [search, setSearch] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.phoneCode.includes(search)
  );

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col">
      {/* Header */}
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

      {/* Country List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredCountries.map((country) => (
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
