
-- Update the area_sqft column to text to support flexible area inputs
ALTER TABLE properties ALTER COLUMN area_sqft TYPE text USING area_sqft::text;
