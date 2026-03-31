DO $$
DECLARE
  v_user_id uuid;
  v_users json[] := array[
    '{"email":"requester@kaiciid.org", "name":"Demo Requester", "role":"requester"}',
    '{"email":"qc@kaiciid.org", "name":"Demo QC", "role":"qc"}',
    '{"email":"co@kaiciid.org", "name":"Demo CO", "role":"co"}',
    '{"email":"finance@kaiciid.org", "name":"Demo Finance", "role":"finance"}',
    '{"email":"admin@kaiciid.org", "name":"Demo Admin", "role":"admin"}'
  ];
  v_user json;
BEGIN
  FOREACH v_user IN ARRAY v_users LOOP
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = (v_user->>'email')::text) THEN
      v_user_id := gen_random_uuid();
      INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role, aud,
        confirmation_token, recovery_token, email_change_token_new,
        email_change, email_change_token_current,
        phone, phone_change, phone_change_token, reauthentication_token
      ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        (v_user->>'email')::text,
        crypt('securepassword123', gen_salt('bf')),
        NOW(), NOW(), NOW(),
        '{"provider": "email", "providers": ["email"]}',
        json_build_object('name', v_user->>'name'),
        false, 'authenticated', 'authenticated',
        '', '', '', '', '',
        NULL, '', '', ''
      );

      INSERT INTO public.profiles (id, email, name, role)
      VALUES (v_user_id, (v_user->>'email')::text, (v_user->>'name')::text, (v_user->>'role')::text)
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END LOOP;
END $$;
