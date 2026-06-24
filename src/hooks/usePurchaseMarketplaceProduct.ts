import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PurchaseDelivery, PurchaseResult } from "@/components/marketplace/PurchaseSuccessModal";

interface PurchaseArgs {
  productId: string;
  productTitle: string;
}

type FriendlyError = {
  title: string;
  description: string;
  variant: "warning" | "destructive";
  insufficientBalance?: boolean;
};

interface PurchaseResponse {
  ok?: boolean;
  orderId?: string;
  deliveryId?: string;
  product?: string;
  charged?: number;
  delivery?: {
    email?: string | null;
    username?: string | null;
    password?: string | null;
    extra?: Record<string, unknown> | null;
  };
  error?: string;
}

async function parseFunctionError(error: unknown) {
  const err = error as {
    context?: { status?: number; clone?: () => Response };
    status?: number;
    message?: string;
  };
  const status = err?.context?.status ?? err?.status;
  let payload: Record<string, unknown> | null = null;

  if (err?.context && typeof err.context.clone === "function") {
    try {
      payload = await err.context.clone().json();
    } catch {
      payload = null;
    }
  }

  const message = [payload?.error, payload?.message, err?.message]
    .find((value): value is string => typeof value === "string" && value.trim().length > 0)
    ?.trim();

  return { status, message, payload };
}

function mapPurchaseError(status?: number, message?: string): FriendlyError {
  const normalized = message?.toLowerCase() ?? "";

  if (
    status === 402 ||
    normalized.includes("insufficient wallet balance")
  ) {
    return {
      title: "Insufficient balance",
      description: "Please top up your wallet to continue.",
      variant: "warning",
      insufficientBalance: true,
    };
  }

  if (
    normalized.includes("out of stock") ||
    normalized.includes("sold out") ||
    normalized.includes("no inventory")
  ) {
    return {
      title: "Out of stock",
      description: "This product is no longer available.",
      variant: "destructive",
    };
  }

  if (normalized.includes("unauthorized")) {
    return {
      title: "Sign in required",
      description: "Please sign in to purchase products.",
      variant: "destructive",
    };
  }

  return {
    title: "Purchase failed",
    description: message ?? "Something went wrong. Please try again.",
    variant: "destructive",
  };
}

function deliveryPayloadToItems(
  payload: Record<string, unknown> | null | undefined
): PurchaseDelivery[] {
  if (!payload) return [];

  const items: PurchaseDelivery[] = [];
  const add = (label: string, value: unknown) => {
    if (value == null || value === "") return;
    items.push({ label, value: String(value) });
  };

  add("Email", payload.email);
  add("Username", payload.username);
  add("Password", payload.password);

  const extra = payload.extra;
  if (extra && typeof extra === "object" && !Array.isArray(extra)) {
    for (const [key, value] of Object.entries(extra as Record<string, unknown>)) {
      add(key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value);
    }
  }

  for (const [key, value] of Object.entries(payload)) {
    if (["email", "username", "password", "extra"].includes(key)) continue;
    if (typeof value === "object") continue;
    add(key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value);
  }

  return items;
}

export type PurchaseOutcome =
  | { ok: true; result: PurchaseResult }
  | { ok: false; insufficientBalance?: boolean };

export function usePurchaseMarketplaceProduct() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const purchase = async ({
    productId,
    productTitle,
  }: PurchaseArgs): Promise<PurchaseOutcome> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<PurchaseResponse>(
        "purchase-marketplace-product",
        { body: { productId } }
      );

      if (error) throw error;

      if (!data?.ok) {
        throw { status: 200, message: data?.error ?? "Purchase failed" };
      }

      let items = deliveryPayloadToItems(
        data.delivery as Record<string, unknown> | undefined
      );

      if (data.deliveryId) {
        const { data: deliveryRow } = await supabase
          .from("marketplace_deliveries")
          .select("id, order_id, delivery_data, delivered_at")
          .eq("id", data.deliveryId)
          .maybeSingle();

        if (deliveryRow?.delivery_data) {
          const fromDb = deliveryPayloadToItems(
            deliveryRow.delivery_data as Record<string, unknown>
          );
          if (fromDb.length > 0) items = fromDb;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["profile-balance"] });

      const orderId = data.orderId ?? "";
      const shortOrderId =
        orderId.length >= 8 ? orderId.slice(0, 8).toUpperCase() : orderId;

      return {
        ok: true,
        result: {
          productTitle: data.product ?? productTitle,
          orderId: shortOrderId,
          items,
        },
      };
    } catch (err) {
      const { status, message } = await parseFunctionError(err);
      const friendly = mapPurchaseError(status, message);

      toast({
        title: friendly.title,
        description: friendly.description,
        variant: friendly.variant,
      });

      return {
        ok: false,
        insufficientBalance: friendly.insufficientBalance,
      };
    } finally {
      setLoading(false);
    }
  };

  return { purchase, loading };
}
