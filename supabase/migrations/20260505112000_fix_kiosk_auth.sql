DO $$
DECLARE
  kiosk_id uuid;
BEGIN
  -- Check if Kiosk user exists in auth.users
  SELECT id INTO kiosk_id FROM auth.users WHERE email = 'kiosk@kaiciid.org';
  
  IF kiosk_id IS NULL THEN
    kiosk_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      kiosk_id,
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
  ELSE
    -- Fix password and ensure email is confirmed
    UPDATE auth.users 
    SET 
      encrypted_password = crypt('Kiosk@123!', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE id = kiosk_id;
  END IF;

  -- Ensure profile exists
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (kiosk_id, 'kiosk@kaiciid.org', 'Kiosk User', 'kiosk')
  ON CONFLICT (id) DO UPDATE SET role = 'kiosk', name = 'Kiosk User';
END $$;
