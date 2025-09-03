-- Add missing columns to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS amenities TEXT,
ADD COLUMN IF NOT EXISTS project_details TEXT;

-- Create index for better search performance on property_type
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(property_type);