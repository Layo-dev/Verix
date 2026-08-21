import { useState } from "react";
import MobileDashboard from "@/components/dashboard/MobileDashboard";
import DesktopReceiveSms from "@/components/dashboard/DesktopReceiveSms";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCountryPricing, useServicePricing } from "@/hooks/usePricing";

const ReceiveSmsPage = () => {
  const isMobile = useIsMobile();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { data: countries = [], isLoading: countriesLoading } = useCountryPricing();
  const { data: services = [], isLoading: servicesLoading } = useServicePricing();

  if (!isMobile) return <DesktopReceiveSms />;

  return (
    <MobileDashboard
      selectedCountry={selectedCountry}
      selectedService={selectedService}
      onSelectCountry={setSelectedCountry}
      onSelectService={setSelectedService}
      countries={countries}
      services={services}
      countriesLoading={countriesLoading}
      servicesLoading={servicesLoading}
    />
  );
};

export default ReceiveSmsPage;
