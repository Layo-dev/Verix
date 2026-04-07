import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useProfileBalance() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile-balance", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user!.id)
        .single();

      if (error) throw error;
      return Number(data?.balance ?? 0);
    },
  });
}
