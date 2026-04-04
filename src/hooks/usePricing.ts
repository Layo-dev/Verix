import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { IconType } from "react-icons";
import {
  SiFacebook,
  SiGoogle,
  SiWhatsapp,
  SiTelegram,
  SiInstagram,
  SiX,
  SiTiktok,
  SiDiscord,
  SiApple,
  SiAmazon,
  SiSpotify,
  SiNetflix,
  SiUber,
  SiPaypal,
} from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";
import { MessageSquare } from "lucide-react";

const serviceIconMap: Record<string, IconType> = {
  facebook: SiFacebook,
  google: SiGoogle,
  whatsapp: SiWhatsapp,
  telegram: SiTelegram,
  instagram: SiInstagram,
  twitter: SiX,
  tiktok: SiTiktok,
  discord: SiDiscord,
  microsoft: FaMicrosoft,
  apple: SiApple,
  amazon: SiAmazon,
  spotify: SiSpotify,
  netflix: SiNetflix,
  uber: SiUber,
  paypal: SiPaypal,
};

// Phone code lookup for countries (DB doesn't store these)
const phoneCodeMap: Record<string, string> = {
  TH: "+66", DE: "+49", GB: "+44", US: "+1", CA: "+1",
  FR: "+33", TR: "+90", PT: "+351", PE: "+51",
  RU: "+7", UA: "+380", KZ: "+7", ID: "+62", MY: "+60",
  MA: "+212", KE: "+254", MM: "+95", PH: "+63", VN: "+84",
  ES: "+34", SP: "+34",
};

export interface CountryItem {
  code: string;
  name: string;
  flag: string;
  phoneCode: string;
  price: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  icon: IconType;
  heroCode?: string;
}

export function useCountryPricing() {
  return useQuery({
    queryKey: ["country_pricing"],
    queryFn: async (): Promise<CountryItem[]> => {
      const { data, error } = await supabase
        .from("country_pricing")
        .select("*");
      if (error) throw error;
      return (data ?? []).map((row) => ({
        code: row.country_code ?? "",
        name: row.country_name ?? "",
        flag: row.country_flag ?? "🌍",
        phoneCode: phoneCodeMap[row.country_code ?? ""] ?? "",
        price: Number(row.price_usd ?? 0),
      }));
    },
  });
}

export function useServicePricing() {
  return useQuery({
    queryKey: ["service_pricing"],
    queryFn: async (): Promise<ServiceItem[]> => {
      const { data, error } = await supabase
        .from("service_pricing")
        .select("*");
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.service_id ?? row.id,
        name: row.service_name ?? "",
        price: Number(row.price_usd ?? 0),
        icon: serviceIconMap[(row.service_id ?? "").toLowerCase()] ?? (MessageSquare as unknown as IconType),
        heroCode: row.hero_code ?? undefined,
      }));
    },
  });
}
