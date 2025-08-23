
-- Update properties table to change price, bedrooms, bathrooms to text fields
-- and add support for multiple images
ALTER TABLE public.properties 
  ALTER COLUMN price TYPE text,
  ALTER COLUMN bedrooms TYPE text, 
  ALTER COLUMN bathrooms TYPE text,
  ADD COLUMN IF NOT EXISTS additional_images text[] DEFAULT '{}';

-- Update the existing image_url column comment for clarity
COMMENT ON COLUMN public.properties.image_url IS 'Main/primary image URL';
COMMENT ON COLUMN public.properties.additional_images IS 'Array of additional image URLs for gallery view';
