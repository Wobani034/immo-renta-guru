-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  email TEXT NOT NULL,
  accepts_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create simulations table to store user simulations
CREATE TABLE public.simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  monthly_rent NUMERIC NOT NULL,
  net_seller_price NUMERIC NOT NULL,
  agency_fees NUMERIC NOT NULL DEFAULT 0,
  renovation_budget NUMERIC NOT NULL DEFAULT 0,
  notary_fees_percent NUMERIC NOT NULL DEFAULT 8,
  credit_duration INTEGER NOT NULL DEFAULT 15,
  interest_rate NUMERIC NOT NULL DEFAULT 3,
  financing_percent NUMERIC NOT NULL DEFAULT 100,
  target_profitability NUMERIC NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on simulations
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

-- Users can view their own simulations
CREATE POLICY "Users can view their own simulations"
  ON public.simulations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own simulations
CREATE POLICY "Users can insert their own simulations"
  ON public.simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own simulations
CREATE POLICY "Users can update their own simulations"
  ON public.simulations FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own simulations
CREATE POLICY "Users can delete their own simulations"
  ON public.simulations FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_simulations_updated_at
  BEFORE UPDATE ON public.simulations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, email, accepts_marketing)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'accepts_marketing')::boolean, false)
  );
  RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();