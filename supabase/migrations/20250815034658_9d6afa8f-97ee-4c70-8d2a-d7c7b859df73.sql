
-- Create enum types for status
CREATE TYPE public.content_status AS ENUM ('published', 'draft');

-- Create blogs table
CREATE TABLE public.blogs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    short_summary TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    status public.content_status NOT NULL DEFAULT 'draft',
    published_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT,
    quote TEXT NOT NULL,
    profile_image TEXT,
    status public.content_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs
CREATE POLICY "Anyone can view published blogs" 
    ON public.blogs 
    FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Only admins can manage blogs" 
    ON public.blogs 
    FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid()
    ));

-- Create RLS policies for testimonials
CREATE POLICY "Anyone can view published testimonials" 
    ON public.testimonials 
    FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Only admins can manage testimonials" 
    ON public.testimonials 
    FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid()
    ));

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('blogs', 'blogs', true),
    ('testimonials', 'testimonials', true);

-- Create storage policies for blogs bucket
CREATE POLICY "Anyone can view blog images" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'blogs');

CREATE POLICY "Only admins can upload blog images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'blogs' AND 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can update blog images" 
    ON storage.objects 
    FOR UPDATE 
    USING (
        bucket_id = 'blogs' AND 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can delete blog images" 
    ON storage.objects 
    FOR DELETE 
    USING (
        bucket_id = 'blogs' AND 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- Create storage policies for testimonials bucket
CREATE POLICY "Anyone can view testimonial images" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'testimonials');

CREATE POLICY "Only admins can upload testimonial images" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'testimonials' AND 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can update testimonial images" 
    ON storage.objects 
    FOR UPDATE 
    USING (
        bucket_id = 'testimonials' AND 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can delete testimonial images" 
    ON storage.objects 
    FOR DELETE 
    USING (
        bucket_id = 'testimonials' AND 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.user_id = auth.uid()
        )
    );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON public.blogs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON public.testimonials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
