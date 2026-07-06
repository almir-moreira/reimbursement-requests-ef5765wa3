// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          code: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          id: string
          name?: string | null
        }
        Update: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      audit_history: {
        Row: {
          action: string | null
          created_at: string | null
          from_status: string | null
          id: string
          request_id: string | null
          to_status: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          request_id?: string | null
          to_status?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          request_id?: string | null
          to_status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "reimbursement_dashboard_view"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "audit_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "v_request_workflow_context"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "audit_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "v_request_workflow_context"
            referencedColumns: ["request_number"]
          },
        ]
      }
      cost_centers: {
        Row: {
          co_email: string | null
          co_name: string | null
          code: string | null
          id: string
          name: string | null
        }
        Insert: {
          co_email?: string | null
          co_name?: string | null
          code?: string | null
          id: string
          name?: string | null
        }
        Update: {
          co_email?: string | null
          co_name?: string | null
          code?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          account: string | null
          cost_center: string | null
          id: string
          name: string | null
          qc_email: string | null
          qc_name: string | null
          workorder: string | null
        }
        Insert: {
          account?: string | null
          cost_center?: string | null
          id: string
          name?: string | null
          qc_email?: string | null
          qc_name?: string | null
          workorder?: string | null
        }
        Update: {
          account?: string | null
          cost_center?: string | null
          id?: string
          name?: string | null
          qc_email?: string | null
          qc_name?: string | null
          workorder?: string | null
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          Country: string
          Currency: string | null
          Currency_Code: string
          Effective_Date: string | null
          Operational_Rate: number | null
        }
        Insert: {
          Country: string
          Currency?: string | null
          Currency_Code: string
          Effective_Date?: string | null
          Operational_Rate?: number | null
        }
        Update: {
          Country?: string
          Currency?: string | null
          Currency_Code?: string
          Effective_Date?: string | null
          Operational_Rate?: number | null
        }
        Relationships: []
      }
      exchange_rates_log: {
        Row: {
          id: string
          imported_at: string | null
          imported_by: string | null
          processed_rows: number
        }
        Insert: {
          id?: string
          imported_at?: string | null
          imported_by?: string | null
          processed_rows: number
        }
        Update: {
          id?: string
          imported_at?: string | null
          imported_by?: string | null
          processed_rows?: number
        }
        Relationships: [
          {
            foreignKeyName: "exchange_rates_log_imported_by_fkey"
            columns: ["imported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          bankAccount: string | null
          bankCode: string | null
          bankCountry: string | null
          bankHolder: string | null
          bankName: string | null
          bic: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          iban: string | null
          id: string
          name: string | null
          organization: string | null
          phone: string | null
          role: string | null
          state: string | null
          swift: string | null
          zipCode: string | null
        }
        Insert: {
          address?: string | null
          bankAccount?: string | null
          bankCode?: string | null
          bankCountry?: string | null
          bankHolder?: string | null
          bankName?: string | null
          bic?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          iban?: string | null
          id: string
          name?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          state?: string | null
          swift?: string | null
          zipCode?: string | null
        }
        Update: {
          address?: string | null
          bankAccount?: string | null
          bankCode?: string | null
          bankCountry?: string | null
          bankHolder?: string | null
          bankName?: string | null
          bic?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          iban?: string | null
          id?: string
          name?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          state?: string | null
          swift?: string | null
          zipCode?: string | null
        }
        Relationships: []
      }
      requests: {
        Row: {
          co_rejection_reason: string | null
          cost_center_id: string | null
          created_at: string | null
          data: Json
          event_id: string | null
          id: string
          payment_method: string | null
          qc_rejection_reason: string | null
          requester_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          co_rejection_reason?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          data: Json
          event_id?: string | null
          id: string
          payment_method?: string | null
          qc_rejection_reason?: string | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          co_rejection_reason?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          data?: Json
          event_id?: string | null
          id?: string
          payment_method?: string | null
          qc_rejection_reason?: string | null
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      smtp_settings: {
        Row: {
          encryption: string | null
          fromEmail: string | null
          host: string | null
          id: string
          password: string | null
          port: string | null
          user: string | null
        }
        Insert: {
          encryption?: string | null
          fromEmail?: string | null
          host?: string | null
          id: string
          password?: string | null
          port?: string | null
          user?: string | null
        }
        Update: {
          encryption?: string | null
          fromEmail?: string | null
          host?: string | null
          id?: string
          password?: string | null
          port?: string | null
          user?: string | null
        }
        Relationships: []
      }
      workflow_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          processed_at: string | null
          rejection_reason: string | null
          request_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          processed_at?: string | null
          rejection_reason?: string | null
          request_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          processed_at?: string | null
          rejection_reason?: string | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_events_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "reimbursement_dashboard_view"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "workflow_events_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_events_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "v_request_workflow_context"
            referencedColumns: ["request_id"]
          },
          {
            foreignKeyName: "workflow_events_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "v_request_workflow_context"
            referencedColumns: ["request_number"]
          },
        ]
      }
      workorders: {
        Row: {
          code: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          id: string
          name?: string | null
        }
        Update: {
          code?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      reimbursement_dashboard_view: {
        Row: {
          amount_eur: number | null
          co_rejection_reason: string | null
          cost_center_code: string | null
          cost_center_id: string | null
          cost_center_name: string | null
          current_responsible_role: string | null
          current_stage: string | null
          data: Json | null
          days_in_current_stage: number | null
          days_since_submission: number | null
          event_id: string | null
          event_name: string | null
          is_delayed_48h: boolean | null
          is_pending_co: boolean | null
          is_pending_finance: boolean | null
          is_pending_qc: boolean | null
          is_pending_requester: boolean | null
          is_processed: boolean | null
          is_rejected: boolean | null
          payment_method: string | null
          qc_rejection_reason: string | null
          rejection_reason: string | null
          request_id: string | null
          requester_email: string | null
          requester_id: string | null
          requester_name: string | null
          stage_started_at: string | null
          status: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_request_workflow_context: {
        Row: {
          co_email: string | null
          co_name: string | null
          co_rejection_reason: string | null
          created_at: string | null
          finance_email: string | null
          payment_method: string | null
          qc_email: string | null
          qc_name: string | null
          qc_rejection_reason: string | null
          request_id: string | null
          request_number: string | null
          requester_email: string | null
          requester_name: string | null
          status: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_next_request_id: { Args: { req_year: string }; Returns: string }
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

