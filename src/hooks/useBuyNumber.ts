import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface BuyNumberArgs {
  countryCode: string;
  serviceId: string;
}

export function useBuyNumber() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const buyNumber = async ({ countryCode, serviceId }: BuyNumberArgs) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("buy-number", {
        body: { countryCode, serviceId },
      });

      if (error || !data?.ok) {
        throw new Error(error?.message || data?.error || "Failed to buy number");
      }

      await queryClient.invalidateQueries({ queryKey: ["profile-balance"] });

      toast({
        title: "Number purchased!",
        description: data?.phoneNumber
          ? `Your number ${data.phoneNumber} is now active.`
          : "Your number is now active.",
      });
      navigate("/dashboard/referral");
    } catch (err: any) {
      toast({
        title: "Purchase error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { buyNumber, loading };
}
