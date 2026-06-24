import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface PurchaseDelivery {
  label: string;
  value: string;
  copyable?: boolean;
}

export interface PurchaseResult {
  productTitle: string;
  orderId: string;
  items: PurchaseDelivery[];
}

interface Props {
  result: PurchaseResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeliveryItem = ({ item }: { item: PurchaseDelivery }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast({ title: "Copied", description: `${item.label} copied to clipboard.` });
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {item.label}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-sm font-medium text-foreground break-all flex-1 min-w-0">
          {item.value}
        </p>
        {item.copyable !== false && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-violet-dark transition-colors px-2 py-1 rounded-md hover:bg-accent/10"
            aria-label={`Copy ${item.label}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const Body = ({
  result,
  onClose,
  onViewOrders,
  isMobile,
}: {
  result: PurchaseResult;
  onClose: () => void;
  onViewOrders: () => void;
  isMobile: boolean;
}) => (
  <div className={cn("flex flex-col", isMobile && "h-full")}>
    <div className={cn("flex-1 overflow-y-auto", isMobile ? "px-5 pt-2 pb-4" : "")}>
      {/* Success header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="mt-3 text-xl font-bold text-foreground">
          Purchase Successful
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your order has been processed.
        </p>
      </div>

      {/* Order info */}
      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Product
            </p>
            <p className="text-sm font-semibold text-foreground truncate">
              {result.productTitle}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Order
            </p>
            <p className="text-sm font-semibold text-foreground">
              #{result.orderId}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          What You Received
        </h3>
        <div className="space-y-2">
          {result.items.map((item, i) => (
            <DeliveryItem key={i} item={item} />
          ))}
        </div>
      </div>
    </div>

    {/* Footer actions */}
    <div
      className={cn(
        "flex flex-col gap-2",
        isMobile
          ? "sticky bottom-0 left-0 right-0 px-5 py-4 bg-background border-t border-border"
          : "pt-5"
      )}
    >
      <Button variant="accent" size="lg" className="w-full" onClick={onViewOrders}>
        View Orders
      </Button>
      <Button variant="outline" size="lg" className="w-full" onClick={onClose}>
        Close
      </Button>
    </div>
  </div>
);

const PurchaseSuccessModal = ({ result, open, onOpenChange }: Props) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!result) return null;

  const handleClose = () => onOpenChange(false);
  const handleViewOrders = () => {
    onOpenChange(false);
    navigate("/dashboard/history");
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="p-0 rounded-t-2xl max-h-[92vh] flex flex-col"
        >
          <SheetTitle className="sr-only">Purchase Successful</SheetTitle>
          <SheetDescription className="sr-only">
            Order #{result.orderId} for {result.productTitle}
          </SheetDescription>
          <Body
            result={result}
            onClose={handleClose}
            onViewOrders={handleViewOrders}
            isMobile
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogTitle className="sr-only">Purchase Successful</DialogTitle>
        <DialogDescription className="sr-only">
          Order #{result.orderId} for {result.productTitle}
        </DialogDescription>
        <Body
          result={result}
          onClose={handleClose}
          onViewOrders={handleViewOrders}
          isMobile={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseSuccessModal;
