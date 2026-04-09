import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaystackCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      toast({
        title: "Payment error",
        description: "Missing payment reference.",
        variant: "destructive",
      });
      navigate("/dashboard", { replace: true });
      return;
    }

    const verify = async () => {
      const { data, error } = await supabase.functions.invoke("paystack-verify", {
        body: { reference },
      });

      if (error || (!data?.ok && !data?.refunded)) {
        toast({
          title: "Verification failed",
          description: error?.message || data?.error || "Could not verify payment.",
          variant: "destructive",
        });
        navigate("/dashboard", { replace: true });
        return;
      }

      if (data?.refunded) {
        await queryClient.invalidateQueries({ queryKey: ["profile-balance"] });
        toast({
          title: "Payment refunded",
          description: "Number could not be assigned. Your payment has been refunded.",
          variant: "destructive",
        });
        navigate("/dashboard", { replace: true });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["profile-balance"] });

      // Distinguish top-up from number purchase
      const isTopUp = data?.type === "topup" || !data?.purchasedNumberId;

      if (isTopUp) {
        toast({
          title: "Balance topped up!",
          description: "Your wallet has been credited successfully.",
        });
        navigate("/dashboard", { replace: true });
      } else {
        toast({
          title: "Number purchased!",
          description: "Your number is now active. Check SMS Inbox.",
        });
        navigate("/dashboard/referral", { replace: true });
      }
    };

    void verify();
  }, [navigate, searchParams, toast, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-6 rounded-xl border border-border bg-card flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Verifying your payment…</p>
      </div>
    </div>
  );
};

export default PaystackCallback;

