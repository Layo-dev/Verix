import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface BuyNumberArgs {
  countryCode: string;
  serviceId: string;
}

type FriendlyBuyError = {
  title: string;
  description: string;
  variant: "warning" | "destructive";
};

const NETWORK_ERROR_MESSAGE = "Something went wrong. Check your connection.";

async function parseFunctionError(error: any) {
  const status = error?.context?.status;
  let payload: Record<string, unknown> | null = null;

  if (error?.context && typeof error.context.json === "function") {
    try {
      payload = await error.context.json();
    } catch {
      try {
        const text = await error.context.text?.();
        payload = text ? { message: text } : null;
      } catch {
        payload = null;
      }
    }
  }

  const message = [payload?.error, payload?.message, error?.message]
    .find((value): value is string => typeof value === "string" && value.trim().length > 0)
    ?.trim();

  return { status, message };
}

function mapBuyNumberError(status?: number, message?: string): FriendlyBuyError {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (status === 402 || normalizedMessage.includes("insufficient wallet balance")) {
    return {
      title: "Insufficient balance",
      description: "Please top up your wallet to continue",
      variant: "warning",
    };
  }

  if (
    normalizedMessage.includes("no_numbers") ||
    normalizedMessage.includes("no numbers available") ||
    normalizedMessage.includes("unsupported country/service")
  ) {
    return {
      title: "No number available",
      description: "No number available right now. Try again shortly.",
      variant: "destructive",
    };
  }

  if (
    normalizedMessage.includes("herosms") ||
    normalizedMessage.includes("grizzlysms") ||
    normalizedMessage.includes("bad_key") ||
    normalizedMessage.includes("banned") ||
    normalizedMessage.includes("error_sql") ||
    normalizedMessage.includes("unexpected payload") ||
    normalizedMessage.includes("failed: http")
  ) {
    return {
      title: "Provider failed",
      description: "Service temporarily unavailable. Try again.",
      variant: "destructive",
    };
  }

  if (!message) {
    return {
      title: "Network error",
      description: NETWORK_ERROR_MESSAGE,
      variant: "destructive",
    };
  }

  return {
    title: "Purchase error",
    description: message,
    variant: "destructive",
  };
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
        variant: "success",
      });
      navigate("/dashboard/referral");
    } catch (err: any) {
      const { status, message } = await parseFunctionError(err);
      const friendlyError = mapBuyNumberError(status, message);

      toast({
        title: friendlyError.title,
        description: friendlyError.description,
        variant: friendlyError.variant,
      });
    } finally {
      setLoading(false);
    }
  };

  return { buyNumber, loading };
}
