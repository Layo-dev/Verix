export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      country_pricing: {
        Row: {
          country_code: string | null
          country_flag: string | null
          country_name: string | null
          created_at: string | null
          hero_id: number | null
          id: string
          price_usd: number | null
        }
        Insert: {
          country_code?: string | null
          country_flag?: string | null
          country_name?: string | null
          created_at?: string | null
          hero_id?: number | null
          id?: string
          price_usd?: number | null
        }
        Update: {
          country_code?: string | null
          country_flag?: string | null
          country_name?: string | null
          created_at?: string | null
          hero_id?: number | null
          id?: string
          price_usd?: number | null
        }
        Relationships: []
      }
      email_otps: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          otp: string
          used: boolean
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          otp: string
          used?: boolean
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          used?: boolean
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_kobo: number
          country_code: string
          created_at: string | null
          currency: string
          id: string
          paystack_reference: string | null
          provider_status: string | null
          purchased_number_id: string | null
          refund_reason: string | null
          refunded: boolean | null
          refunded_at: string | null
          service_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_kobo: number
          country_code: string
          created_at?: string | null
          currency?: string
          id?: string
          paystack_reference?: string | null
          provider_status?: string | null
          purchased_number_id?: string | null
          refund_reason?: string | null
          refunded?: boolean | null
          refunded_at?: string | null
          service_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_kobo?: number
          country_code?: string
          created_at?: string | null
          currency?: string
          id?: string
          paystack_reference?: string | null
          provider_status?: string | null
          purchased_number_id?: string | null
          refund_reason?: string | null
          refunded?: boolean | null
          refunded_at?: string | null
          service_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_purchased_number_id_fkey"
            columns: ["purchased_number_id"]
            isOneToOne: false
            referencedRelation: "purchased_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          auto_fallback: boolean | null
          country_code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          price_band: string
          service_id: string
        }
        Insert: {
          auto_fallback?: boolean | null
          country_code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          price_band: string
          service_id: string
        }
        Update: {
          auto_fallback?: boolean | null
          country_code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          price_band?: string
          service_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      provider_routes: {
        Row: {
          country_code: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          provider: string | null
          service_id: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          provider?: string | null
          service_id?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          provider?: string | null
          service_id?: string | null
        }
        Relationships: []
      }
      purchased_numbers: {
        Row: {
          activation_id: string | null
          country_code: string
          country_flag: string
          created_at: string
          expired_at: string | null
          expires_at: string
          id: string
          otp_status: string | null
          phone_number: string
          price_usd: number
          provider: string | null
          refund_amount: number | null
          refunded: boolean | null
          service_name: string
          status: Database["public"]["Enums"]["number_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activation_id?: string | null
          country_code: string
          country_flag?: string
          created_at?: string
          expired_at?: string | null
          expires_at: string
          id?: string
          otp_status?: string | null
          phone_number: string
          price_usd?: number
          provider?: string | null
          refund_amount?: number | null
          refunded?: boolean | null
          service_name: string
          status?: Database["public"]["Enums"]["number_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activation_id?: string | null
          country_code?: string
          country_flag?: string
          created_at?: string
          expired_at?: string | null
          expires_at?: string
          id?: string
          otp_status?: string | null
          phone_number?: string
          price_usd?: number
          provider?: string | null
          refund_amount?: number | null
          refunded?: boolean | null
          service_name?: string
          status?: Database["public"]["Enums"]["number_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_pricing: {
        Row: {
          created_at: string | null
          hero_code: string | null
          id: string
          price_usd: number | null
          service_id: string | null
          service_name: string | null
        }
        Insert: {
          created_at?: string | null
          hero_code?: string | null
          id?: string
          price_usd?: number | null
          service_id?: string | null
          service_name?: string | null
        }
        Update: {
          created_at?: string | null
          hero_code?: string | null
          id?: string
          price_usd?: number | null
          service_id?: string | null
          service_name?: string | null
        }
        Relationships: []
      }
      sms_messages: {
        Row: {
          body: string
          id: string
          number_id: string
          otp_code: string | null
          received_at: string
          sender: string
        }
        Insert: {
          body: string
          id?: string
          number_id: string
          otp_code?: string | null
          received_at?: string
          sender: string
        }
        Update: {
          body?: string
          id?: string
          number_id?: string
          otp_code?: string | null
          received_at?: string
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_messages_number_id_fkey"
            columns: ["number_id"]
            isOneToOne: false
            referencedRelation: "purchased_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number | null
          created_at: string | null
          description: string | null
          id: string
          reference: string | null
          status: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          reference?: string | null
          status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          reference?: string | null
          status?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_wallet_balance: {
        Args: { p_amount: number; p_user_id: string }
        Returns: number
      }
      deduct_wallet_balance: {
        Args: { p_amount: number; p_user_id: string }
        Returns: boolean
      }
      expire_stale_numbers: { Args: never; Returns: number }
    }
    Enums: {
      number_status: "active" | "expiring" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      number_status: ["active", "expiring", "expired"],
    },
  },
} as const
