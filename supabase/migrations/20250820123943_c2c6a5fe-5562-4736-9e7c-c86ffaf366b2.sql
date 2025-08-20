
-- 1) Add a slug column to blogs
ALTER TABLE public.blogs
ADD COLUMN IF NOT EXISTS slug text;

-- 2) Helper function to slugify text
CREATE OR REPLACE FUNCTION public.slugify(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
AS $$
  SELECT trim(both '-' from regexp_replace(lower(input), '[^a-z0-9]+', '-', 'g'));
$$;

-- 3) Function to generate a unique slug for blogs
CREATE OR REPLACE FUNCTION public.generate_unique_blog_slug(base text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text := public.slugify(base);
  candidate text := base_slug;
  i int := 1;
BEGIN
  IF base_slug IS NULL OR base_slug = '' THEN
    base_slug := 'post';
    candidate := base_slug;
  END IF;

  -- Try base first, then append -2, -3, ...
  WHILE EXISTS (SELECT 1 FROM public.blogs WHERE slug = candidate) LOOP
    i := i + 1;
    candidate := base_slug || '-' || i::text;
  END LOOP;

  RETURN candidate;
END;
$$;

-- 4) Trigger function to set slug on INSERT and keep uniqueness if user edits slug
CREATE OR REPLACE FUNCTION public.blogs_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If slug provided, ensure uniqueness; if not, generate from title
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_unique_blog_slug(COALESCE(NEW.title, 'post'));
  ELSE
    NEW.slug := public.generate_unique_blog_slug(NEW.slug);
  END IF;

  RETURN NEW;
END;
$$;

-- 5) Trigger function to handle slug on UPDATE
-- Keeps existing slug when title changes unless user clears or changes slug
CREATE OR REPLACE FUNCTION public.blogs_sync_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If user cleared slug or it's null, (re)generate from current title
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_unique_blog_slug(COALESCE(NEW.title, 'post'));
    RETURN NEW;
  END IF;

  -- If user changed slug explicitly, enforce uniqueness
  IF NEW.slug IS DISTINCT FROM OLD.slug THEN
    NEW.slug := public.generate_unique_blog_slug(NEW.slug);
  END IF;

  RETURN NEW;
END;
$$;

-- 6) Create triggers
DROP TRIGGER IF EXISTS trg_blogs_set_slug ON public.blogs;
CREATE TRIGGER trg_blogs_set_slug
BEFORE INSERT ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.blogs_set_slug();

DROP TRIGGER IF EXISTS trg_blogs_sync_slug ON public.blogs;
CREATE TRIGGER trg_blogs_sync_slug
BEFORE UPDATE ON public.blogs
FOR EACH ROW
EXECUTE FUNCTION public.blogs_sync_slug();

-- 7) Backfill existing rows
UPDATE public.blogs
SET slug = public.generate_unique_blog_slug(title)
WHERE slug IS NULL OR slug = '';

-- 8) Add a unique index and make slug NOT NULL
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'blogs_slug_key'
  ) THEN
    CREATE UNIQUE INDEX blogs_slug_key ON public.blogs (slug);
  END IF;
END$$;

ALTER TABLE public.blogs
ALTER COLUMN slug SET NOT NULL;
