-- Enable pgcrypto for uuid generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT,
  city TEXT,
  "bankName" TEXT,
  country TEXT,
  address TEXT,
  "zipCode" TEXT,
  phone TEXT,
  "bankHolder" TEXT,
  iban TEXT,
  swift TEXT,
  "bankCode" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: requests
CREATE TABLE IF NOT EXISTS public.requests (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: cost_centers
CREATE TABLE IF NOT EXISTS public.cost_centers (
  id TEXT PRIMARY KEY,
  code TEXT,
  name TEXT,
  "coName" TEXT,
  "coEmail" TEXT
);

-- Table: accounts
CREATE TABLE IF NOT EXISTS public.accounts (
  id TEXT PRIMARY KEY,
  code TEXT,
  name TEXT
);

-- Table: workorders
CREATE TABLE IF NOT EXISTS public.workorders (
  id TEXT PRIMARY KEY,
  code TEXT,
  name TEXT
);

-- Table: events
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  name TEXT,
  "costCenter" TEXT,
  account TEXT,
  workorder TEXT,
  "qcName" TEXT,
  "qcEmail" TEXT
);

-- Table: exchange_rates
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id TEXT PRIMARY KEY,
  currency TEXT,
  "rateToUsd" NUMERIC
);

-- Table: countries
CREATE TABLE IF NOT EXISTS public.countries (
  id TEXT PRIMARY KEY,
  name TEXT
);

-- Table: smtp_settings
CREATE TABLE IF NOT EXISTS public.smtp_settings (
  id TEXT PRIMARY KEY,
  host TEXT,
  port TEXT,
  "user" TEXT,
  password TEXT,
  "fromEmail" TEXT,
  encryption TEXT
);

-- Table: audit_history
CREATE TABLE IF NOT EXISTS public.audit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT REFERENCES public.requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT,
  from_status TEXT,
  to_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.profiles;
CREATE POLICY "Enable read access for all authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
CREATE POLICY "Enable update for users based on id" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Master data (cost_centers, accounts, workorders, events, exchange_rates, countries)
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.cost_centers;
CREATE POLICY "Enable read access for all authenticated users" ON public.cost_centers FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for admin" ON public.cost_centers;
CREATE POLICY "Enable all access for admin" ON public.cost_centers FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.accounts;
CREATE POLICY "Enable read access for all authenticated users" ON public.accounts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for admin" ON public.accounts;
CREATE POLICY "Enable all access for admin" ON public.accounts FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.workorders;
CREATE POLICY "Enable read access for all authenticated users" ON public.workorders FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for admin" ON public.workorders;
CREATE POLICY "Enable all access for admin" ON public.workorders FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.events;
CREATE POLICY "Enable read access for all authenticated users" ON public.events FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for admin" ON public.events;
CREATE POLICY "Enable all access for admin" ON public.events FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.exchange_rates;
CREATE POLICY "Enable read access for all authenticated users" ON public.exchange_rates FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for admin" ON public.exchange_rates;
CREATE POLICY "Enable all access for admin" ON public.exchange_rates FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.countries;
CREATE POLICY "Enable read access for all authenticated users" ON public.countries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for admin" ON public.countries;
CREATE POLICY "Enable all access for admin" ON public.countries FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- SMTP settings
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.smtp_settings;
CREATE POLICY "Enable read access for all authenticated users" ON public.smtp_settings FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Enable all access for admin" ON public.smtp_settings;
CREATE POLICY "Enable all access for admin" ON public.smtp_settings FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Audit History
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.audit_history;
CREATE POLICY "Enable read access for all authenticated users" ON public.audit_history FOR SELECT TO authenticated USING (true);

-- Requests (RLS configured exactly to allow CO to access only their cost center data)
DROP POLICY IF EXISTS "Users can read requests" ON public.requests;
CREATE POLICY "Users can read requests" ON public.requests FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'qc', 'finance')) OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'co'
    AND p.email IN (
       SELECT "coEmail" FROM public.cost_centers 
       WHERE code = requests.data->>'costCenter' OR name = requests.data->>'costCenter'
    )
  )
);

DROP POLICY IF EXISTS "Users can insert own requests" ON public.requests;
CREATE POLICY "Users can insert own requests" ON public.requests FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'qc', 'co', 'finance'))
);

DROP POLICY IF EXISTS "Users can update requests" ON public.requests;
CREATE POLICY "Users can update requests" ON public.requests FOR UPDATE TO authenticated USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'qc', 'finance')) OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'co'
    AND p.email IN (
       SELECT "coEmail" FROM public.cost_centers 
       WHERE code = requests.data->>'costCenter' OR name = requests.data->>'costCenter'
    )
  )
);

DROP POLICY IF EXISTS "Users can delete own requests or admin" ON public.requests;
CREATE POLICY "Users can delete own requests or admin" ON public.requests FOR DELETE TO authenticated USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger to track status changes in audit_history
CREATE OR REPLACE FUNCTION public.track_request_status_change()
RETURNS trigger AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_history (request_id, user_id, action, from_status, to_status)
    VALUES (NEW.id, COALESCE(current_user_id, NEW.user_id), 'Created', NULL, NEW.status);
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.audit_history (request_id, user_id, action, from_status, to_status)
    VALUES (NEW.id, COALESCE(current_user_id, NEW.user_id), 'Status Changed', OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS request_status_audit_trigger ON public.requests;
CREATE TRIGGER request_status_audit_trigger
  AFTER INSERT OR UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.track_request_status_change();


-- Seed Data (Users & Master Data)
DO $$
DECLARE
  v_admin_id uuid;
  v_qc_id uuid;
  v_co_id uuid;
  v_finance_id uuid;
  v_requester_id uuid;
  v_almir_id uuid;
BEGIN
  -- Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@kaiciid.org') THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@kaiciid.org',
      crypt('password', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Admin User"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_admin_id, 'admin@kaiciid.org', 'Admin User', 'admin') ON CONFLICT DO NOTHING;
  END IF;

  -- QC
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'qc@kaiciid.org') THEN
    v_qc_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_qc_id, '00000000-0000-0000-0000-000000000000', 'qc@kaiciid.org',
      crypt('password', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Quality Control"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_qc_id, 'qc@kaiciid.org', 'Quality Control', 'qc') ON CONFLICT DO NOTHING;
  END IF;

  -- CO
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'co@kaiciid.org') THEN
    v_co_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_co_id, '00000000-0000-0000-0000-000000000000', 'co@kaiciid.org',
      crypt('password', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Certifying Officer"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_co_id, 'co@kaiciid.org', 'Certifying Officer', 'co') ON CONFLICT DO NOTHING;
  END IF;

  -- Finance
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'finance@kaiciid.org') THEN
    v_finance_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_finance_id, '00000000-0000-0000-0000-000000000000', 'finance@kaiciid.org',
      crypt('password', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Finance Dept"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_finance_id, 'finance@kaiciid.org', 'Finance Dept', 'finance') ON CONFLICT DO NOTHING;
  END IF;

  -- Requester (dorna)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dorna@example.com') THEN
    v_requester_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_requester_id, '00000000-0000-0000-0000-000000000000', 'dorna@example.com',
      crypt('password', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Dorna Khan"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role, city, "bankName", country, address, "zipCode", phone, "bankHolder", iban, swift, "bankCode") 
    VALUES (v_requester_id, 'dorna@example.com', 'Dorna Khan', 'requester', 'Bristol', 'HSBC UK', 'UK', 'Flat 71 Hope Quay, Rope Walk', 'BS1 6ZF', '+447946609450', 'Dorna Khan', '20547565/GB25HBUK40166420547565', 'HBUKGB4196Y', '40-16-64') ON CONFLICT DO NOTHING;
  END IF;
  
  -- Almir (seed)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'almir.moreira@gmail.com') THEN
    v_almir_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_almir_id, '00000000-0000-0000-0000-000000000000', 'almir.moreira@gmail.com',
      crypt('securepassword123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"name": "Almir Moreira"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', NULL, '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_almir_id, 'almir.moreira@gmail.com', 'Almir Moreira', 'admin') ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Seed Master Data
INSERT INTO public.cost_centers (id, code, name, "coName", "coEmail") VALUES
('cc-1', 'CC-01', 'Operations', 'Certifying Officer', 'co@kaiciid.org')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.accounts (id, code, name) VALUES
('a-1', '62000', 'Travel'),
('a-2', '62001', 'Meals')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.workorders (id, code, name) VALUES
('w-1', 'P1134-12', 'Field Visit')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.events (id, name, "costCenter", account, workorder, "qcName", "qcEmail") VALUES
('ev-1', 'Workshop', 'CC-01', '62000', 'P1134-12', 'Quality Control', 'qc@kaiciid.org'),
('ev-2', 'Conference', 'CC-02', '62001', 'P1135-12', 'Jane Smith', 'jane.smith@kaiciid.org')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exchange_rates (id, currency, "rateToUsd") VALUES
('r-1', 'GBP', 1.25),
('r-2', 'EUR', 1.08),
('r-3', 'USD', 1.0),
('r-4', 'KES', 0.0076)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.countries (id, name) VALUES
('c-1', 'Kenya'),
('c-2', 'Portugal'),
('c-3', 'USA'),
('c-4', 'UK')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.smtp_settings (id, host, port, "user", password, "fromEmail", encryption) VALUES
('smtp-1', 'smtp.gmail.com', '587', 'admin@kaiciid.org', '', 'noreply@kaiciid.org', 'TLS')
ON CONFLICT (id) DO NOTHING;
