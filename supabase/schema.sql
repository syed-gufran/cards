-- ========================================================================
-- CARD ASSIST: PREMIUM WEDDING INVITATION DESIGNER & PRINT PLATFORM
-- PRODUCTION SUPABASE / POSTGRESQL DATABASE SCHEMA
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'press_operator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DESIGN CATEGORIES
CREATE TABLE IF NOT EXISTS public.design_categories (
  id TEXT PRIMARY KEY, -- e.g. 'Royal', 'Muslim', 'Sikh', 'Hindu', 'Minimal', 'Floral'
  title TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DESIGN TEMPLATES
CREATE TABLE IF NOT EXISTS public.design_templates (
  id TEXT PRIMARY KEY, -- e.g. 'ROYAL-RAJ-01'
  title TEXT NOT NULL,
  category_id TEXT REFERENCES public.design_categories(id),
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  width_mm NUMERIC NOT NULL DEFAULT 127,
  height_mm NUMERIC NOT NULL DEFAULT 178,
  orientation TEXT DEFAULT 'portrait' CHECK (orientation IN ('portrait', 'landscape', 'square')),
  base_price_per_card NUMERIC NOT NULL DEFAULT 65.00,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  theme_color TEXT DEFAULT '#801222',
  front_design_json JSONB NOT NULL,
  back_design_json JSONB NOT NULL,
  sample_bride_name TEXT DEFAULT 'Gayatri',
  sample_groom_name TEXT DEFAULT 'Devavrat',
  sample_wedding_date TEXT DEFAULT 'Sunday, 14th December 2026',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMER PROJECTS (PERSISTENT SAVED DESIGNS)
CREATE TABLE IF NOT EXISTS public.customer_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_token TEXT, -- Allows anonymous guests to save design in browser session
  template_id TEXT REFERENCES public.design_templates(id),
  front_design_json JSONB NOT NULL,
  back_design_json JSONB NOT NULL,
  events_json JSONB DEFAULT '[]'::JSONB,
  printing_specs_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- e.g. 'ORD-2026-9041'
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_full_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  notes TEXT,
  template_id TEXT REFERENCES public.design_templates(id),
  template_title TEXT NOT NULL,
  front_customization JSONB NOT NULL,
  back_customization JSONB NOT NULL,
  events_json JSONB DEFAULT '[]'::JSONB,
  specs_json JSONB NOT NULL,
  price_breakdown_json JSONB NOT NULL,
  status TEXT DEFAULT 'New Order' CHECK (
    status IN (
      'New Order',
      'Under Review',
      'Awaiting Customer Approval',
      'Approved for Printing',
      'Printing in Progress',
      'Dispatched',
      'Completed',
      'Cancelled'
    )
  ),
  payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid (Advance)', 'Paid (Full)')),
  payment_method TEXT DEFAULT 'Razorpay UPI/Card/NetBanking',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  print_ready_pdf_url TEXT,
  proof_approved BOOLEAN DEFAULT TRUE,
  tracking_number TEXT,
  courier_partner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER STATUS HISTORY AUDIT LOG
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  changed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRICING & MATERIAL COSTS CONFIGURATION
CREATE TABLE IF NOT EXISTS public.pricing_configurations (
  id TEXT PRIMARY KEY, -- e.g. 'PAPER_VELVET', 'FINISH_GOLD_FOIL'
  item_type TEXT NOT NULL CHECK (item_type IN ('paper', 'finish', 'size', 'envelope', 'tax', 'discount_tier')),
  name TEXT NOT NULL,
  surcharge_per_unit NUMERIC NOT NULL DEFAULT 0.00,
  details JSONB DEFAULT '{}'::JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CUSTOMER UPLOADED ASSETS (PHOTOS, CRESTS & MONOGRAMS)
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id TEXT REFERENCES public.orders(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Public can read templates
CREATE POLICY "Public can view active design templates"
  ON public.design_templates FOR SELECT
  USING (is_active = TRUE);

-- Customers can view & edit their own projects
CREATE POLICY "Users can manage own projects"
  ON public.customer_projects FOR ALL
  USING (auth.uid() = user_id);

-- Customers can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

