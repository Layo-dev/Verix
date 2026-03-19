import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BuyNumberArgs {
  countryCode: string;
  serviceId: string;
}

export function useBuyNumber() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const buyNumber = async ({ countryCode, serviceId }: BuyNumberArgs) => {
    setLoading(true);
    try {
      // 1. Initialize payment via edge function
      const { data, error } = await supabase.functions.invoke("paystack-init", {
        body: { countryCode, serviceId },
      });

      if (error || !data?.authorization_url) {
        throw new Error(error?.message || data?.error || "Failed to initialize payment");
      }

      const { authorization_url } = data;

      // 2. Redirect to Paystack hosted payment page
      window.location.href = authorization_url;
      // Loading state will naturally reset when user returns via callback route.
    } catch (err: any) {
      toast({
        title: "Payment error",
        description: err.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return { buyNumber, loading };
}
