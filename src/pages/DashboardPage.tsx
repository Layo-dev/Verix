import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import CountryList from "@/components/dashboard/CountryList";
import ServiceList from "@/components/dashboard/ServiceList";
import MyNumbers from "@/components/dashboard/MyNumbers";
import { Settings } from "lucide-react";

const DashboardPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>("RU");
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Empty orders for demo - in real app this would come from API
  const orders: Array<{
    id: string;
    number: string;
    service: string;
    expiresAt: Date;
  }> = [];

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 lg:pl-4 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pl-12 lg:pl-0">
          <h1 className="text-2xl font-bold text-foreground">Receive SMS</h1>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Country List */}
          <div className="h-[500px] md:h-[600px]">
            <CountryList
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
            />
          </div>

          {/* Service List */}
          <div className="h-[500px] md:h-[600px]">
            <ServiceList
              selectedService={selectedService}
              onSelectService={setSelectedService}
            />
          </div>

          {/* My Numbers */}
          <div className="h-[500px] md:h-[600px] md:col-span-2 lg:col-span-1">
            <MyNumbers orders={orders} />
          </div>
        </div>

        {/* Settings Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">
            Select a country and service to purchase a virtual number for SMS verification.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
