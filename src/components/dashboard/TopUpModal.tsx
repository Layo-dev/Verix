import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PRESETS = [5, 10, 20, 50];

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TopUpModal = ({ open, onOpenChange }: TopUpModalProps) => {
  const [amount, setAmount] = useState<number | "">(10);
  const [loading, setLoading] = useState(false);

  const numericAmount = typeof amount === "number" ? amount : 0;
  const isValid = numericAmount >= 1 && numericAmount <= 500;

  const handlePay = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-init", {
        body: { type: "topup", amount: numericAmount },
      });
      if (error) throw error;
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (err: any) {
      toast({
        title: "Payment failed",
        description: err.message || "Could not initialize payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top up balance</DialogTitle>
          <DialogDescription>Select or enter an amount to add to your wallet.</DialogDescription>
        </DialogHeader>

        {/* Preset chips */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(p)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                amount === p
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-foreground border-border hover:bg-accent"
              )}
            >
              ${p}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Or enter custom amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              type="number"
              min={1}
              max={500}
              value={amount}
              onChange={(e) => {
                const v = e.target.value;
                setAmount(v === "" ? "" : Number(v));
              }}
              className="pl-7"
              placeholder="0.00"
            />
          </div>
          {typeof amount === "number" && !isValid && (
            <p className="text-xs text-destructive">Enter an amount between $1 and $500</p>
          )}
        </div>

        <Button onClick={handlePay} disabled={!isValid || loading} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </span>
          ) : (
            `Pay $${numericAmount.toFixed(2)} with Paystack`
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpModal;
