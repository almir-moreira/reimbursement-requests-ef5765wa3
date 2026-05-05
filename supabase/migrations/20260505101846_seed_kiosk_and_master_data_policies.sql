-- Seed Kiosk User
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'kiosk@kaiciid.org') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'kiosk@kaiciid.org',
      crypt('Kiosk@123!', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Kiosk User"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '',
      NULL,
      '', '', ''
    );

    INSERT INTO public.profiles (id, email, name, role)
    VALUES (new_user_id, 'kiosk@kaiciid.org', 'Kiosk User', 'kiosk')
    ON CONFLICT (id) DO UPDATE SET role = 'kiosk';
  ELSE
    UPDATE public.profiles 
    SET role = 'kiosk' 
    WHERE email = 'kiosk@kaiciid.org';
  END IF;
END $$;

-- Update RLS Policies for Master Data Tables to explicitly allow ALL CRUD for admin
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY['accounts', 'cost_centers', 'countries', 'events', 'workorders', 'smtp_settings'];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Enable all access for admin" ON public.%I', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "admin_all" ON public.%I', tbl);
    
    EXECUTE format('
      CREATE POLICY "admin_all" ON public.%I
      FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))
      WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ''admin''))
    ', tbl);
  END LOOP;
END $$;

-- For exchange_rates, ensure admin and finance have full CRUD
DROP POLICY IF EXISTS "Enable all access for admin and finance" ON public.exchange_rates;
DROP POLICY IF EXISTS "admin_finance_all" ON public.exchange_rates;

CREATE POLICY "admin_finance_all" ON public.exchange_rates
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'finance')))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'finance')));
