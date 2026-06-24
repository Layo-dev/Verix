import { Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProductDetails {
  id: string;
  title: string;
  image: string;
  category: string;
  country: string;
  countryFlag: string;
  stock: number;
  price: number;
  description: string | null;
  deliveryItems: string[];
}

interface Props {
  product: ProductDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBuy: (product: ProductDetails) => void;
}

const Body = ({ product, onBuy, isMobile }: { product: ProductDetails; onBuy: (p: ProductDetails) => void; isMobile: boolean }) => {
  const inStock = product.stock > 0;
  return (
    <div className={cn("flex flex-col", isMobile ? "h-full" : "")}>
      <div className={cn("flex-1 overflow-y-auto", isMobile ? "px-5 pt-2 pb-4" : "")}>
        {/* Image */}
        <div
          className={cn(
            "w-full bg-muted rounded-xl overflow-hidden flex items-center justify-center text-5xl",
            isMobile ? "aspect-[16/10]" : "aspect-video"
          )}
        >
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <span aria-hidden>{product.countryFlag}</span>
          )}
        </div>

        {/* Title */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-foreground">{product.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="mr-1">{product.countryFlag}</span>
            {product.country} · {product.category}
          </p>
        </div>

        {/* Description */}
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            Description
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            {product.description?.trim() || "No description provided."}
          </p>
        </div>

        {/* What You'll Receive */}
        {product.deliveryItems.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              What You'll Receive
            </h3>
            <ul className="space-y-2">
              {product.deliveryItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stock + Price */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Stock Available
            </p>
            <p
              className={cn(
                "text-base font-bold mt-0.5",
                inStock ? "text-foreground" : "text-destructive"
              )}
            >
              {inStock ? product.stock : "Out of stock"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Price
            </p>
            <p className="text-base font-bold text-foreground mt-0.5">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Buy Now */}
      <div
        className={cn(
          isMobile
            ? "sticky bottom-0 left-0 right-0 px-5 py-4 bg-background border-t border-border"
            : "pt-5"
        )}
      >
        <Button
          variant="accent"
          size="lg"
          className="w-full"
          disabled={!inStock}
          onClick={() => onBuy(product)}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

const ProductDetailsModal = ({ product, open, onOpenChange, onBuy }: Props) => {
  const isMobile = useIsMobile();

  if (!product) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="p-0 rounded-t-2xl max-h-[92vh] flex flex-col"
        >
          <SheetTitle className="sr-only">{product.title}</SheetTitle>
          <SheetDescription className="sr-only">
            {product.category} from {product.country}
          </SheetDescription>
          <Body product={product} onBuy={onBuy} isMobile />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-6">
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {product.category} from {product.country}
        </DialogDescription>
        <Body product={product} onBuy={onBuy} isMobile={false} />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
