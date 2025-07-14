-- Create visitors table for tracking website analytics
CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  page_visited TEXT NOT NULL,
  referrer TEXT,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page_views table for detailed page tracking
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  time_entered TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  time_left TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Only admins can view visitor data" 
ON public.visitors 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Anyone can insert visitor data" 
ON public.visitors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update visitor data" 
ON public.visitors 
FOR UPDATE 
USING (true);

CREATE POLICY "Only admins can view page views" 
ON public.page_views 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Anyone can insert page views" 
ON public.page_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update page views" 
ON public.page_views 
FOR UPDATE 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_visitors_session_id ON public.visitors(session_id);
CREATE INDEX idx_visitors_created_at ON public.visitors(created_at);
CREATE INDEX idx_page_views_session_id ON public.page_views(visitor_session_id);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_visitors_updated_at
BEFORE UPDATE ON public.visitors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();