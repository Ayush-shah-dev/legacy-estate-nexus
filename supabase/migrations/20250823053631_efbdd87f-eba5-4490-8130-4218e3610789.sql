
BEGIN;

-- Convert price back to numeric, stripping non-numeric chars (keep the decimal point).
ALTER TABLE public.properties
  ALTER COLUMN price TYPE numeric USING
    CASE
      WHEN price IS NULL OR trim(price) = '' THEN NULL
      ELSE NULLIF(regexp_replace(price, '[^0-9\.]', '', 'g'), '')::numeric
    END;

-- Convert bedrooms back to integer, keeping only digits.
ALTER TABLE public.properties
  ALTER COLUMN bedrooms TYPE integer USING
    CASE
      WHEN bedrooms IS NULL OR trim(bedrooms) = '' THEN NULL
      ELSE NULLIF(regexp_replace(bedrooms, '\D', '', 'g'), '')::integer
    END;

-- Convert bathrooms back to integer, keeping only digits.
ALTER TABLE public.properties
  ALTER COLUMN bathrooms TYPE integer USING
    CASE
      WHEN bathrooms IS NULL OR trim(bathrooms) = '' THEN NULL
      ELSE NULLIF(regexp_replace(bathrooms, '\D', '', 'g'), '')::integer
    END;

COMMIT;
