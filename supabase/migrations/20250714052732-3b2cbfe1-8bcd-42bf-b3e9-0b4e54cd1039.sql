-- Create tables for contact submissions, properties, and reviews
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2),
  location TEXT,
  property_type TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table for dashboard access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to properties and approved reviews
CREATE POLICY "Anyone can view properties" 
ON public.properties 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view approved reviews" 
ON public.reviews 
FOR SELECT 
USING (approved = true);

-- Create policies for contact submissions (admins only)
CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Anyone can insert contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policies for admin operations
CREATE POLICY "Only admins can manage properties" 
ON public.properties 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Only admins can manage reviews" 
ON public.reviews 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Only admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample properties
INSERT INTO public.properties (title, description, price, location, property_type, bedrooms, bathrooms, area_sqft, featured, status) VALUES
('Luxury 3BHK Apartment', 'Spacious apartment with modern amenities in Andheri West', 15000000, 'Andheri West, Mumbai', 'Apartment', 3, 2, 1200, true, 'available'),
('2BHK Sea View Flat', 'Beautiful sea-facing apartment in Bandra', 12000000, 'Bandra West, Mumbai', 'Apartment', 2, 2, 950, true, 'available'),
('Commercial Office Space', 'Prime commercial space in BKC', 25000000, 'Bandra Kurla Complex, Mumbai', 'Commercial', 0, 2, 2000, false, 'available'),
('Duplex Villa', 'Independent villa with garden in Juhu', 35000000, 'Juhu, Mumbai', 'Villa', 4, 3, 2500, true, 'available');

-- Insert sample reviews
INSERT INTO public.reviews (name, rating, review_text, approved) VALUES
('Rajesh Kumar', 5, 'Excellent service! Regal Estate helped me find my dream home in Andheri. Very professional team.', true),
('Priya Sharma', 5, 'Outstanding experience. The team was very responsive and guided me through the entire process.', true),
('Amit Patel', 4, 'Good service and reasonable prices. Would recommend to others looking for properties in Mumbai.', true),
('Sneha Desai', 5, 'Professional and trustworthy. They helped me sell my property quickly at a great price.', true);