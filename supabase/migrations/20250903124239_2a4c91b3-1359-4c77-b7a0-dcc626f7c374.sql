-- Add youtube_url to properties and create storage bucket for property images with policies

-- 1) Add youtube_url column
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- 2) Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3) Storage policies for property-images
-- Public read access
CREATE POLICY IF NOT EXISTS "Property images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');

-- Allow admins to upload property images
CREATE POLICY IF NOT EXISTS "Admins can upload property images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

-- Allow admins to update property images
CREATE POLICY IF NOT EXISTS "Admins can update property images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'property-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

-- Allow admins to delete property images
CREATE POLICY IF NOT EXISTS "Admins can delete property images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);
