DO $$
DECLARE
  v_req_id uuid;
  v_qc_id uuid;
  v_co_id uuid;
  v_fin_id uuid;
  v_admin_id uuid;
BEGIN
  -- Requester
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'requester@kaiciid.org') THEN
    v_req_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_req_id, '00000000-0000-0000-0000-000000000000', 'requester@kaiciid.org', crypt('securepassword123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Demo Requester"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_req_id, 'requester@kaiciid.org', 'Demo Requester', 'requester') ON CONFLICT (id) DO NOTHING;
  END IF;

  -- QC
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'qc@kaiciid.org') THEN
    v_qc_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_qc_id, '00000000-0000-0000-0000-000000000000', 'qc@kaiciid.org', crypt('securepassword123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Demo QC"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_qc_id, 'qc@kaiciid.org', 'Demo QC', 'qc') ON CONFLICT (id) DO NOTHING;
  END IF;

  -- CO
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'co@kaiciid.org') THEN
    v_co_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_co_id, '00000000-0000-0000-0000-000000000000', 'co@kaiciid.org', crypt('securepassword123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Demo CO"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_co_id, 'co@kaiciid.org', 'Demo CO', 'co') ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Finance
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'finance@kaiciid.org') THEN
    v_fin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_fin_id, '00000000-0000-0000-0000-000000000000', 'finance@kaiciid.org', crypt('securepassword123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Demo Finance"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_fin_id, 'finance@kaiciid.org', 'Demo Finance', 'finance') ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Admin
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@kaiciid.org') THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@kaiciid.org', crypt('securepassword123', gen_salt('bf')), NOW(),
      NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"name": "Demo Admin"}',
      false, 'authenticated', 'authenticated', '', '', '', '', '', '', '', ''
    );
    INSERT INTO public.profiles (id, email, name, role) VALUES (v_admin_id, 'admin@kaiciid.org', 'Demo Admin', 'admin') ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
