-- Supabase Schema for Doamandeh Tours & Travel

-- 1. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('vehicle-rental', 'tattoo', 'villa', 'travel', 'surfing-lesson')),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  duration TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active services
CREATE POLICY "Allow public read active services"
  ON public.services
  FOR SELECT
  USING (true);

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read own profile
CREATE POLICY "Allow users to read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 3. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public insert booking
CREATE POLICY "Allow public insert bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (true);

-- 4. Seed Initial Services (if not exists)
INSERT INTO public.services (category, title, description, price, unit, is_active)
VALUES
  ('vehicle-rental', 'Sewa Motor', 'Sewa motor untuk harian atau wisata.', 75000, 'per hari', true),
  ('vehicle-rental', 'Sewa Mobil', 'Sewa mobil untuk harian atau wisata.', 350000, 'per hari', true),
  ('tattoo', 'Custom Tattoo Session', 'Layanan tato custom sesuai desain.', 500000, 'per sesi', true),
  ('villa', 'Villa 2 Kamar', 'Villa nyaman untuk liburan atau long stay.', 800000, 'per malam', true),
  ('travel', 'Paket Tour 1 Hari', 'Paket perjalanan wisata 1 hari.', 450000, 'per orang', true),
  ('surfing-lesson', 'Surfing Lesson Beginner', 'Kelas surfing untuk pemula.', 300000, 'per sesi', true)
ON CONFLICT DO NOTHING;

-- 5. Site Settings Table (Key-Value Format for Dynamic CMS)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site_settings
CREATE POLICY "Allow public read site_settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Allow authenticated users (admin) to manage site_settings
CREATE POLICY "Allow authenticated manage site_settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Storage Bucket & RLS Policies for Images / Services
-- Run this in Supabase SQL Editor to allow public read and authenticated admin upload to 'images' bucket:

-- Allow public read access to images bucket
CREATE POLICY "Allow public read images bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images' OR bucket_id = 'services');

-- Allow authenticated users (admin) to upload to images bucket
CREATE POLICY "Allow authenticated insert images bucket"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images' OR bucket_id = 'services');

-- Allow authenticated users to update images in images bucket
CREATE POLICY "Allow authenticated update images bucket"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images' OR bucket_id = 'services');

-- Allow authenticated users to delete images in images bucket
CREATE POLICY "Allow authenticated delete images bucket"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images' OR bucket_id = 'services');


