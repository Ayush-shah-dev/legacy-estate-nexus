-- Create a new admin user with the specified credentials
-- First, insert into auth.users table (this is a special case for admin setup)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'ajay_punjabi2000@hotmail.com',
  crypt('AjayRegalEstate1988', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Add the user to admin_users table
INSERT INTO admin_users (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'ajay_punjabi2000@hotmail.com';