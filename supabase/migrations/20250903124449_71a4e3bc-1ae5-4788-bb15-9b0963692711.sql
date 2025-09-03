-- Fix security warnings by setting proper search paths for all functions

-- Update slugify function to set search_path
CREATE OR REPLACE FUNCTION public.slugify(input text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
 SET search_path = public
AS $function$
  SELECT trim(both '-' from regexp_replace(lower(input), '[^a-z0-9]+', '-', 'g'));
$function$;

-- Update generate_unique_blog_slug function to set search_path
CREATE OR REPLACE FUNCTION public.generate_unique_blog_slug(base text)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
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
$function$;

-- Update blogs_set_slug function to set search_path
CREATE OR REPLACE FUNCTION public.blogs_set_slug()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- If slug provided, ensure uniqueness; if not, generate from title
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_unique_blog_slug(COALESCE(NEW.title, 'post'));
  ELSE
    NEW.slug := public.generate_unique_blog_slug(NEW.slug);
  END IF;

  RETURN NEW;
END;
$function$;

-- Update blogs_sync_slug function to set search_path
CREATE OR REPLACE FUNCTION public.blogs_sync_slug()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
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
$function$;

-- Update update_updated_at_column function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;