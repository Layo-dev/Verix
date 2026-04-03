import { useState } from "react";
import { Menu, Wallet, Settings, Star, Search, ArrowUpDown, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import DashboardSidebar from "./DashboardSidebar";
import MyNumbers from "./MyNumbers";
import SupportButton from "@/components/auth/SupportButton";
import { services } from "./ServiceList";
import { useBuyNumber } from "@/hooks/useBuyNumber";


const countries = [
 // { code: "RU", name: "Russia", flag: "🇷🇺", phoneCode: "+7", count: 15420, price: 0.50, status: "high" as const },
  //{ code: "UA", name: "Ukraine", flag: "🇺🇦", phoneCode: "+380", count: 8900, price: 0.5, status: "high" as const },
  //{ code: "KZ", name: "Kazakhstan", flag: "🇰🇿", phoneCode: "+7", count: 5200, price: 0.60, status: "high" as const },
  //{ code: "ID", name: "Indonesia", flag: "🇮🇩", phoneCode: "+62", count: 12300, price: 0.45, status: "high" as const },
  //{ code: "MY", name: "Malaysia", flag: "🇲🇾", phoneCode: "+60", count: 3400, price: 0.4, status: "medium" as const },
  //{ code: "MA", name: "Morocco", flag: "🇲🇦", phoneCode: "+212", count: 9977, price: 0.2, status: "high" as const },
  //{ code: "KE", name: "Kenya", flag: "🇰🇪", phoneCode: "+254", count: 2100, price: 0.90, status: "medium" as const },
  //{ code: "MM", name: "Myanmar", flag: "🇲🇲", phoneCode: "+95", count: 1800, price: 1.20, status: "low" as const },
  //{ code: "PH", name: "Philippines", flag: "🇵🇭", phoneCode: "+63", count: 7600, price: 0.55, status: "high" as const },
  //{ code: "VN", name: "Vietnam", flag: "🇻🇳", phoneCode: "+84", count: 6200, price: 0.65, status: "high" as const },
  { code: "TH", name: "Thailand", flag: "🇹🇭", phoneCode: "+66", count: 4500, price: 0.70, status: "high" as const },
  { code: "DE", name: "Germany", flag: "🇩🇪", phoneCode: "+49", count: 890, price: 1, status: "low" as const },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", phoneCode: "+44", count: 1200, price: 0.45, status: "low" as const },
  { code: "US", name: "United States", flag: "🇺🇸", phoneCode: "+1", count: 3200, price: 2.5, status: "medium" as const },
  { code: "CA", name: "Canada", flag: "🇨🇦", phoneCode: "+1", count: 1500, price: 0.19, status: "low" as const },
  //{ code: "SP", name: "Spain", flag: "🇪🇸", phoneCode: "+34", count: 1000, price: 1, status: "low" as const },
  { code: "FR", name: "France", flag: "🇫🇷", phoneCode: "+33", count: 1000, price: 1, status: "low" as const },
  { code: "TR", name: "Turkey", flag: "🇹🇷", phoneCode: "+90", count: 1000, price: 1, status: "low" as const },
  { code: "PT", name: "Portugal", flag: "🇵🇹", phoneCode: "+351", count: 1000, price: 1, status: "low" as const },

];

interface MobileDashboardProps {
  selectedCountry: string | null;
  selectedService: string | null;
  onSelectCountry: (code: string) => void;
  onSelectService: (id: string) => void;
}

const MobileDashboard = ({
  selectedCountry,
  selectedService,
  onSelectCountry,
  onSelectService,
}: MobileDashboardProps) => {
  const [activeTab, setActiveTab] = useState<"buy" | "numbers">("buy");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countrySheetOpen, setCountrySheetOpen] = useState(false);
  const [serviceSheetOpen, setServiceSheetOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const { buyNumber, loading: buyLoading } = useBuyNumber();

  const selectedCountryData = countries.find((c) => c.code === selectedCountry);
  const selectedServiceData = services.find((s) => s.id === selectedService);

  const totalPrice = (selectedCountryData?.price || 0) + (selectedServiceData?.price || 0);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.phoneCode.includes(countrySearch)
  );

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const orders: Array<{
    id: string;
    number: string;
    service: string;
    expiresAt: Date;
  }> = [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <button className="p-2 -ml-2 text-foreground" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <DashboardSidebar contentOnly onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-bold text-foreground">Receive SMS</h1>

        <div className="flex items-center gap-1 text-foreground">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">$0</span>
        </div>
      </header>

      {/* Tab Bar */}
      <div className="p-4 pb-0">
        <div className="bg-muted rounded-full p-1 flex">
          <button
            onClick={() => setActiveTab("buy")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-full transition-colors",
              activeTab === "buy"
                ? "bg-card text-[hsl(200,100%,50%)] shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Buy a number
          </button>
          <button
            onClick={() => setActiveTab("numbers")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-full transition-colors",
              activeTab === "numbers"
                ? "bg-card text-[hsl(200,100%,50%)] shadow-sm"
                : "text-muted-foreground"
            )}
          >
            My numbers
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        {activeTab === "buy" ? (
          <div className="space-y-4">
            {/* Service Selection Chip */}
            <button
              onClick={() => setServiceSheetOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full bg-[hsl(200,100%,95%)] text-[hsl(200,100%,40%)] font-medium"
            >
              {selectedServiceData ? (
                (() => {
                  const Icon = selectedServiceData.icon;
                  return <Icon className="h-6 w-6 shrink-0" />;
                })()
              ) : (
                <span className="text-xl">📱</span>
              )}
              <span>{selectedServiceData?.name || "Select service"}</span>
            </button>
            <Sheet open={serviceSheetOpen} onOpenChange={setServiceSheetOpen}>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
                <SheetHeader className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg font-bold">Website or service</SheetTitle>
                  </div>
                </SheetHeader>
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Find a site or service"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <ScrollArea className="h-[calc(85vh-140px)]">
                  <div className="p-2">
                    {filteredServices.map((service) => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => {
                            onSelectService(service.id);
                            setServiceSheetOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                            selectedService === service.id
                              ? "bg-[hsl(200,100%,95%)]"
                              : "hover:bg-muted"
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{service.name}</p>
                            <p
                              className={cn(
                                "text-xs",
                                selectedService === service.id
                                  ? "text-white/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {service.count.toLocaleString()} numbers
                            </p>
                          </div>
                          <span
                            className={cn(
                              "text-sm font-semibold",
                              selectedService === service.id
                                ? "text-white"
                                : "text-accent"
                            )}
                          >
                            ${service.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Country Selection Chip */}
            <button
              onClick={() => setCountrySheetOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted text-foreground"
            >
              <span className="text-xl">{selectedCountryData?.flag || "🌍"}</span>
              <span className="flex-1 text-left font-medium">
                {selectedCountryData?.phoneCode || "Select country"}
              </span>
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            <Sheet open={countrySheetOpen} onOpenChange={setCountrySheetOpen}>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
                <SheetHeader className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg font-bold">Country</SheetTitle>
                  </div>
                </SheetHeader>
                <div className="p-4 border-b border-border flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Find a country"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-input bg-background">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <ScrollArea className="h-[calc(85vh-140px)]">
                  <div className="p-2">
                    {filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => {
                          onSelectCountry(country.code);
                          setCountrySheetOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                          selectedCountry === country.code
                            ? "bg-[hsl(200,100%,95%)]"
                            : "hover:bg-muted"
                        )}
                      >
                        <Star className="w-5 h-5 text-muted-foreground" />
                        <span className="text-xl">{country.flag}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">{country.name}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            {country.phoneCode}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {country.count.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Buy Button */}
            <button
              className="w-full py-4 rounded-full bg-[hsl(200,100%,50%)] text-white font-semibold text-base disabled:opacity-50"
              disabled={!selectedCountry || !selectedService || buyLoading}
              onClick={() => {
                if (selectedCountry && selectedService) {
                  buyNumber({ countryCode: selectedCountry, serviceId: selectedService });
                }
              }}
            >
              {buyLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                `Buy a number for $${totalPrice.toFixed(2)}`
              )}
            </button>
          </div>
        ) : (
          <div className="h-full">
            <MyNumbers orders={orders} />
          </div>
        )}
      </div>

      {/* Support FAB */}
      <SupportButton />
    </div>
  );
};

export default MobileDashboard;
