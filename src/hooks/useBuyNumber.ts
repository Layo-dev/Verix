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

      const { reference, authorization_url } = data;

      // 2. Open Paystack popup
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const popup = new PaystackPop();

      popup.resumeTransaction({
        accessCode: data.access_code,
        onSuccess: async () => {
          // 3. Verify payment
          try {
            const { data: verifyData, error: verifyError } =
              await supabase.functions.invoke("paystack-verify", {
                body: { reference },
              });

            if (verifyError || !verifyData?.ok) {
              throw new Error(verifyError?.message || verifyData?.error || "Verification failed");
            }

            toast({
              title: "Number purchased!",
              description: "Your number is now active. Check SMS Inbox.",
            });

            // Navigate to SMS inbox
            navigate("/dashboard/referral");
          } catch (err: any) {
            toast({
              title: "Verification failed",
              description: err.message,
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          toast({
            title: "Payment cancelled",
            description: "You cancelled the payment.",
            variant: "destructive",
          });
          setLoading(false);
        },
      });
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
