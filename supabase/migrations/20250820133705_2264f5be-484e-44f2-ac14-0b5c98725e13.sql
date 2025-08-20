
-- Convert numeric fields to text to allow alphanumeric values
ALTER TABLE public.properties
  ALTER COLUMN price TYPE text USING price::text,
  ALTER COLUMN bedrooms TYPE text USING bedrooms::text,
  ALTER COLUMN bathrooms TYPE text USING bathrooms::text;
