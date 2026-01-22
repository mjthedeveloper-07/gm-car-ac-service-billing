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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      invoices: {
        Row: {
          balance_amount: number | null
          buyers_order_no: string | null
          cgst: number
          created_at: string
          customer_address: string | null
          customer_gst: string | null
          customer_name: string
          customer_phone: string | null
          customer_state: string | null
          date: string
          delivery_date: string | null
          discount_amount: number | null
          discount_percent: number | null
          due_date: string | null
          id: string
          igst: number
          invoice_number: string
          is_locked: boolean | null
          last_modified_by: string | null
          notes: string | null
          payment_mode: string | null
          received_amount: number | null
          reverse_charge: string | null
          services: Json
          sgst: number
          ship_to_address: string | null
          ship_to_gst: string | null
          ship_to_name: string | null
          ship_to_state: string | null
          status: string | null
          subtotal: number
          suppliers_ref: string | null
          tax_type: string
          terms_of_delivery: string | null
          total: number
          total_in_words: string | null
          updated_at: string
          user_id: string
          vehicle_model: string | null
          vehicle_number: string | null
        }
        Insert: {
          balance_amount?: number | null
          buyers_order_no?: string | null
          cgst?: number
          created_at?: string
          customer_address?: string | null
          customer_gst?: string | null
          customer_name: string
          customer_phone?: string | null
          customer_state?: string | null
          date?: string
          delivery_date?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          due_date?: string | null
          id?: string
          igst?: number
          invoice_number: string
          is_locked?: boolean | null
          last_modified_by?: string | null
          notes?: string | null
          payment_mode?: string | null
          received_amount?: number | null
          reverse_charge?: string | null
          services?: Json
          sgst?: number
          ship_to_address?: string | null
          ship_to_gst?: string | null
          ship_to_name?: string | null
          ship_to_state?: string | null
          status?: string | null
          subtotal?: number
          suppliers_ref?: string | null
          tax_type?: string
          terms_of_delivery?: string | null
          total?: number
          total_in_words?: string | null
          updated_at?: string
          user_id: string
          vehicle_model?: string | null
          vehicle_number?: string | null
        }
        Update: {
          balance_amount?: number | null
          buyers_order_no?: string | null
          cgst?: number
          created_at?: string
          customer_address?: string | null
          customer_gst?: string | null
          customer_name?: string
          customer_phone?: string | null
          customer_state?: string | null
          date?: string
          delivery_date?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          due_date?: string | null
          id?: string
          igst?: number
          invoice_number?: string
          is_locked?: boolean | null
          last_modified_by?: string | null
          notes?: string | null
          payment_mode?: string | null
          received_amount?: number | null
          reverse_charge?: string | null
          services?: Json
          sgst?: number
          ship_to_address?: string | null
          ship_to_gst?: string | null
          ship_to_name?: string | null
          ship_to_state?: string | null
          status?: string | null
          subtotal?: number
          suppliers_ref?: string | null
          tax_type?: string
          terms_of_delivery?: string | null
          total?: number
          total_in_words?: string | null
          updated_at?: string
          user_id?: string
          vehicle_model?: string | null
          vehicle_number?: string | null
        }
        Relationships: []
      }
      predefined_services: {
        Row: {
          created_at: string
          default_rate: number
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_rate: number
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_rate?: number
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          bank_account_no: string | null
          bank_branch: string | null
          bank_ifsc_code: string | null
          bank_name: string | null
          bank_upi_id: string | null
          cgst_rate: number
          company_address: string | null
          company_name: string
          created_at: string
          email: string | null
          gst_number: string | null
          igst_rate: number
          logo_url: string | null
          phone: string | null
          sgst_rate: number
          terms_and_conditions: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bank_account_no?: string | null
          bank_branch?: string | null
          bank_ifsc_code?: string | null
          bank_name?: string | null
          bank_upi_id?: string | null
          cgst_rate?: number
          company_address?: string | null
          company_name: string
          created_at?: string
          email?: string | null
          gst_number?: string | null
          igst_rate?: number
          logo_url?: string | null
          phone?: string | null
          sgst_rate?: number
          terms_and_conditions?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bank_account_no?: string | null
          bank_branch?: string | null
          bank_ifsc_code?: string | null
          bank_name?: string | null
          bank_upi_id?: string | null
          cgst_rate?: number
          company_address?: string | null
          company_name?: string
          created_at?: string
          email?: string | null
          gst_number?: string | null
          igst_rate?: number
          logo_url?: string | null
          phone?: string | null
          sgst_rate?: number
          terms_and_conditions?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: { Args: { user_uuid: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
