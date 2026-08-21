import { useState } from "react";
import { Settings } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CountryList from "@/components/dashboard/CountryList";
import ServiceList from "@/components/dashboard/ServiceList";
import MyNumbers from "@/components/dashboard/MyNumbers";
import { useBuyNumber } from "@/hooks/useBuyNumber";
import { useCountryPricing, useServicePricing } from "@/hooks/usePricing";

const DesktopReceiveSms = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { buyNumber, loading } = useBuyNumber();
  const { data: countries = [], isLoading: countriesLoading } = useCountryPricing();
  const { data: services = [], isLoading: servicesLoading } = useServicePricing();

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    if (selectedCountry) {
      buyNumber({ countryCode: selectedCountry, serviceId });
    }
  };

  const orders: Array<{
    id: string;
    number: string;
    service: string;
    expiresAt: Date;
  }> = [];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />

      <main className="flex-1 p-4 lg:p-8 lg:pl-4 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Receive SMS</h1>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="h-[500px] md:h-[600px]">
            <CountryList
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              countries={countries}
              loading={countriesLoading}
            />
          </div>

          <div className="h-[500px] md:h-[600px]">
            <ServiceList
              selectedService={selectedService}
              onSelectService={handleSelectService}
              loading={loading || servicesLoading}
              services={services}
            />
          </div>

          <div className="h-[500px] md:h-[600px] md:col-span-2 lg:col-span-1">
            <MyNumbers orders={orders} />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Processing payment..."
              : "Select a country and service to purchase a virtual number for SMS verification."}
          </p>
        </div>
      </main>
    </div>
  );
};

export default DesktopReceiveSms;
