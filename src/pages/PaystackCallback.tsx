import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaystackCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        toast({
          title: "Payment refunded",
          description: "Number could not be assigned. Your payment has been refunded.",
          variant: "destructive",
        });
        navigate("/dashboard", { replace: true });
        return;
      }

      toast({
        title: "Number purchased!",
        description: "Your number is now active. Check SMS Inbox.",
      });
      navigate("/dashboard/referral", { replace: true });
    };

    void verify();
  }, [navigate, searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-6 rounded-xl border border-border bg-card">
        <p className="text-sm text-muted-foreground">Verifying your payment...</p>
      </div>
    </div>
  );
};

export default PaystackCallback;

