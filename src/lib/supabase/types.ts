// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
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
            foreignKeyName: 'audit_history_request_id_fkey'
            columns: ['request_id']
            isOneToOne: false
            referencedRelation: 'requests'
            referencedColumns: ['id']
          },
        ]
      }
      cost_centers: {
        Row: {
          code: string | null
          coEmail: string | null
          coName: string | null
          id: string
          name: string | null
        }
        Insert: {
          code?: string | null
          coEmail?: string | null
          coName?: string | null
          id: string
          name?: string | null
        }
        Update: {
          code?: string | null
          coEmail?: string | null
          coName?: string | null
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
          costCenter: string | null
          id: string
          name: string | null
          qcEmail: string | null
          qcName: string | null
          workorder: string | null
        }
        Insert: {
          account?: string | null
          costCenter?: string | null
          id: string
          name?: string | null
          qcEmail?: string | null
          qcName?: string | null
          workorder?: string | null
        }
        Update: {
          account?: string | null
          costCenter?: string | null
          id?: string
          name?: string | null
          qcEmail?: string | null
          qcName?: string | null
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
            foreignKeyName: 'exchange_rates_log_imported_by_fkey'
            columns: ['imported_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
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
          created_at: string | null
          data: Json
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'requests_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: accounts
//   id: text (not null)
//   code: text (nullable)
//   name: text (nullable)
// Table: audit_history
//   id: uuid (not null, default: gen_random_uuid())
//   request_id: text (nullable)
//   user_id: uuid (nullable)
//   action: text (nullable)
//   from_status: text (nullable)
//   to_status: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: cost_centers
//   id: text (not null)
//   code: text (nullable)
//   name: text (nullable)
//   coName: text (nullable)
//   coEmail: text (nullable)
// Table: countries
//   id: text (not null)
//   name: text (nullable)
// Table: events
//   id: text (not null)
//   name: text (nullable)
//   costCenter: text (nullable)
//   account: text (nullable)
//   workorder: text (nullable)
//   qcName: text (nullable)
//   qcEmail: text (nullable)
// Table: exchange_rates
//   Currency_Code: character varying (not null)
//   Country: character varying (not null)
//   Currency: character varying (nullable)
//   Effective_Date: date (nullable)
//   Operational_Rate: numeric (nullable)
// Table: exchange_rates_log
//   id: uuid (not null, default: gen_random_uuid())
//   imported_at: timestamp with time zone (nullable, default: now())
//   processed_rows: integer (not null)
//   imported_by: uuid (nullable)
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   name: text (nullable)
//   role: text (nullable)
//   city: text (nullable)
//   bankName: text (nullable)
//   country: text (nullable)
//   address: text (nullable)
//   zipCode: text (nullable)
//   phone: text (nullable)
//   bankHolder: text (nullable)
//   iban: text (nullable)
//   swift: text (nullable)
//   bankCode: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   organization: text (nullable)
//   state: text (nullable)
//   bankAccount: text (nullable)
//   bic: text (nullable)
//   bankCountry: text (nullable)
// Table: requests
//   id: text (not null)
//   user_id: uuid (nullable)
//   status: text (nullable)
//   data: jsonb (not null)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: smtp_settings
//   id: text (not null)
//   host: text (nullable)
//   port: text (nullable)
//   user: text (nullable)
//   password: text (nullable)
//   fromEmail: text (nullable)
//   encryption: text (nullable)
// Table: workorders
//   id: text (not null)
//   code: text (nullable)
//   name: text (nullable)

// --- CONSTRAINTS ---
// Table: accounts
//   PRIMARY KEY accounts_pkey: PRIMARY KEY (id)
// Table: audit_history
//   PRIMARY KEY audit_history_pkey: PRIMARY KEY (id)
//   FOREIGN KEY audit_history_request_id_fkey: FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE
//   FOREIGN KEY audit_history_user_id_fkey: FOREIGN KEY (user_id) REFERENCES auth.users(id)
// Table: cost_centers
//   PRIMARY KEY cost_centers_pkey: PRIMARY KEY (id)
// Table: countries
//   PRIMARY KEY countries_pkey: PRIMARY KEY (id)
// Table: events
//   PRIMARY KEY events_pkey: PRIMARY KEY (id)
// Table: exchange_rates
//   PRIMARY KEY exchange_rates_pkey: PRIMARY KEY ("Country")
// Table: exchange_rates_log
//   FOREIGN KEY exchange_rates_log_imported_by_fkey: FOREIGN KEY (imported_by) REFERENCES profiles(id) ON DELETE SET NULL
//   PRIMARY KEY exchange_rates_log_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: requests
//   PRIMARY KEY requests_pkey: PRIMARY KEY (id)
//   FOREIGN KEY requests_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: smtp_settings
//   PRIMARY KEY smtp_settings_pkey: PRIMARY KEY (id)
// Table: workorders
//   PRIMARY KEY workorders_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: accounts
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
// Table: audit_history
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: cost_centers
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
// Table: countries
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
// Table: events
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
// Table: exchange_rates
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "admin_finance_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'finance'::text])))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'finance'::text])))))
// Table: exchange_rates_log
//   Policy "Enable insert for admin and finance" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'finance'::text])))))
//   Policy "Enable read access for authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: profiles
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Enable update for users based on id" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth.uid() = id)
//     WITH CHECK: (auth.uid() = id)
// Table: requests
//   Policy "Users can delete own requests or admin" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text)))))
//   Policy "Users can insert own requests" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((user_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'qc'::text, 'co'::text, 'finance'::text]))))))
//   Policy "Users can read requests" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'qc'::text, 'finance'::text]))))) OR (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'co'::text) AND (p.email IN ( SELECT cost_centers."coEmail"            FROM cost_centers           WHERE ((cost_centers.code = (requests.data ->> 'costCenter'::text)) OR (cost_centers.name = (requests.data ->> 'costCenter'::text)))))))))
//   Policy "Users can update requests" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'qc'::text, 'finance'::text]))))) OR (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'co'::text) AND (p.email IN ( SELECT cost_centers."coEmail"            FROM cost_centers           WHERE ((cost_centers.code = (requests.data ->> 'costCenter'::text)) OR (cost_centers.name = (requests.data ->> 'costCenter'::text)))))))))
// Table: smtp_settings
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
// Table: workorders
//   Policy "Enable read access for all authenticated users" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "admin_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))))

// --- DATABASE FUNCTIONS ---
// FUNCTION track_request_status_change()
//   CREATE OR REPLACE FUNCTION public.track_request_status_change()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     current_user_id UUID := auth.uid();
//   BEGIN
//     IF TG_OP = 'INSERT' THEN
//       INSERT INTO public.audit_history (request_id, user_id, action, from_status, to_status)
//       VALUES (NEW.id, COALESCE(current_user_id, NEW.user_id), 'Created', NULL, NEW.status);
//     ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
//       INSERT INTO public.audit_history (request_id, user_id, action, from_status, to_status)
//       VALUES (NEW.id, COALESCE(current_user_id, NEW.user_id), 'Status Changed', OLD.status, NEW.status);
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: requests
//   request_status_audit_trigger: CREATE TRIGGER request_status_audit_trigger AFTER INSERT OR UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION track_request_status_change()
