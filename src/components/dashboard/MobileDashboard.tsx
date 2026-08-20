import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  Loading03Icon,
  Globe02Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import MobileHeader from "./mobile/MobileHeader";
import BottomNav from "./mobile/BottomNav";
import { useBuyNumber } from "@/hooks/useBuyNumber";
import type { CountryItem, ServiceItem } from "@/hooks/usePricing";

interface MobileDashboardProps {
  selectedCountry: string | null;
  selectedService: string | null;
  onSelectCountry: (code: string | null) => void;
  onSelectService: (id: string | null) => void;
  countries: CountryItem[];
  services: ServiceItem[];
  countriesLoading?: boolean;
  servicesLoading?: boolean;
}

const StepCard = ({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-border bg-card p-4">
    <h2 className="text-base font-bold text-foreground mb-3">
      {index}. {title}
    </h2>
    {children}
  </section>
);

const MobileDashboard = ({
  selectedCountry,
  selectedService,
  onSelectCountry,
  onSelectService,
  countries,
  services,
  countriesLoading,
  servicesLoading,
}: MobileDashboardProps) => {
  const [countrySheetOpen, setCountrySheetOpen] = useState(false);
  const [serviceSheetOpen, setServiceSheetOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const serviceSearchInputRef = useRef<HTMLInputElement>(null);
  const countrySearchInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (serviceSheetOpen) serviceSearchInputRef.current?.focus();
  }, [serviceSheetOpen]);

  useEffect(() => {
    if (countrySheetOpen) countrySearchInputRef.current?.focus();
  }, [countrySheetOpen]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <MobileHeader title="Receive SMS" />

      <main className="px-4 pt-4 pb-28 space-y-4">
        {/* Step 1 — service */}
        <StepCard index={1} title="Choose service">
          {selectedServiceData ? (
            <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
              <selectedServiceData.icon className="h-5 w-5 shrink-0 text-foreground" />
              <span className="flex-1 text-sm font-semibold text-foreground truncate">
                {selectedServiceData.name}
              </span>
              <button
                aria-label="Clear service"
                onClick={() => onSelectService(null)}
                className="text-muted-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setServiceSheetOpen(true)}
              className="w-full flex items-center gap-3 rounded-xl border border-border bg-muted px-4 py-3 text-left"
            >
              <span className="flex w-8 h-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <HugeiconsIcon icon={SmartPhone01Icon} size={18} />
              </span>
              <span className="flex-1 text-sm font-medium text-muted-foreground">
                Search by service
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-muted-foreground" />
            </button>
          )}
        </StepCard>

        {/* Step 2 — country */}
        <StepCard index={2} title="Choose country">
          {selectedCountryData ? (
            <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
              <span className="text-xl">{selectedCountryData.flag}</span>
              <span className="flex-1 text-sm font-semibold text-foreground truncate">
                {selectedCountryData.name}
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  {selectedCountryData.phoneCode}
                </span>
              </span>
              <button
                aria-label="Clear country"
                onClick={() => onSelectCountry(null)}
                className="text-muted-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCountrySheetOpen(true)}
              className="w-full flex items-center gap-3 rounded-xl border border-border bg-muted px-4 py-3 text-left"
            >
              <span className="flex w-8 h-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <HugeiconsIcon icon={Globe02Icon} size={18} />
              </span>
              <span className="flex-1 text-sm font-medium text-muted-foreground">
                Search by country
              </span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-muted-foreground" />
            </button>
          )}
        </StepCard>

        {/* Step 3 — buy */}
        {selectedCountry && selectedService && (
          <StepCard index={3} title="Buy">
            <button
              onClick={() =>
                buyNumber({ countryCode: selectedCountry, serviceId: selectedService })
              }
              disabled={buyLoading}
              className="w-full rounded-full bg-accent py-3.5 text-base font-semibold text-accent-foreground disabled:opacity-60"
            >
              {buyLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={Loading03Icon} size={18} className="animate-spin" />
                  Processing...
                </span>
              ) : (
                `Buy for $${totalPrice.toFixed(2)}`
              )}
            </button>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              If the code is not received, the funds are automatically refunded to your balance
              after 20 minutes.
            </p>
          </StepCard>
        )}
      </main>

      {/* Service sheet */}
      <Sheet
        open={serviceSheetOpen}
        onOpenChange={(open) => {
          setServiceSheetOpen(open);
          if (!open) setServiceSearch("");
        }}
      >
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="text-lg font-bold text-left">Website or service</SheetTitle>
          </SheetHeader>
          <div className="p-4 border-b border-border">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                ref={serviceSearchInputRef}
                type="text"
                placeholder="Search by service"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(85vh-150px)]">
            <div className="p-2">
              {servicesLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-3">
                      <Skeleton className="w-6 h-6 rounded" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))
                : filteredServices.map((service) => {
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.id}
                        onClick={() => {
                          onSelectService(service.id);
                          setServiceSheetOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors",
                          selectedService === service.id ? "bg-accent/10" : "hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0 text-foreground" />
                        <p className="flex-1 min-w-0 text-sm font-medium text-foreground truncate">
                          {service.name}
                        </p>
                        <span className="text-sm font-semibold text-accent">
                          from ${service.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Country sheet */}
      <Sheet
        open={countrySheetOpen}
        onOpenChange={(open) => {
          setCountrySheetOpen(open);
          if (!open) setCountrySearch("");
        }}
      >
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle className="text-lg font-bold text-left">Country</SheetTitle>
          </SheetHeader>
          <div className="p-4 border-b border-border">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                ref={countrySearchInputRef}
                type="text"
                placeholder="Search by country"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(85vh-150px)]">
            <div className="p-2">
              {countriesLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-3">
                      <Skeleton className="w-6 h-6 rounded" />
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))
                : filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        onSelectCountry(country.code);
                        setCountrySheetOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors",
                        selectedCountry === country.code ? "bg-accent/10" : "hover:bg-muted"
                      )}
                    >
                      <span className="text-xl">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {country.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{country.phoneCode}</p>
                      </div>
                      <span className="text-sm font-semibold text-accent">
                        from ${country.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <BottomNav />
    </div>
  );
};

export default MobileDashboard;
