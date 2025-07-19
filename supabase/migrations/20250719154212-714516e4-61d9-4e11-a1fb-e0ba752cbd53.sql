-- Create client_users table for property owners/clients
CREATE TABLE public.client_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;

-- Create policies for client users
CREATE POLICY "Users can view their own client profile" 
ON public.client_users 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own client profile" 
ON public.client_users 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own client profile" 
ON public.client_users 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Update properties table to link to client_users
ALTER TABLE public.properties 
ADD COLUMN client_user_id UUID REFERENCES public.client_users(id);

-- Create new RLS policies for properties to allow clients to manage their own properties
CREATE POLICY "Clients can view their own properties" 
ON public.properties 
FOR SELECT 
USING (
  client_user_id IN (
    SELECT id FROM public.client_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Clients can create their own properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (
  client_user_id IN (
    SELECT id FROM public.client_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Clients can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (
  client_user_id IN (
    SELECT id FROM public.client_users WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Clients can delete their own properties" 
ON public.properties 
FOR DELETE 
USING (
  client_user_id IN (
    SELECT id FROM public.client_users WHERE user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates on client_users
CREATE TRIGGER update_client_users_updated_at
BEFORE UPDATE ON public.client_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();