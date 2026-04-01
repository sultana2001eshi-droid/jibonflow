
-- tool_history: stores all tool usage
CREATE TABLE public.tool_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- saved_documents: for exported PDFs, applications etc
CREATE TABLE public.saved_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- shop_profiles: for cash memo shop info
CREATE TABLE public.shop_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ai_media_history: for AI image tool history
CREATE TABLE public.ai_media_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  input_image TEXT,
  output_image TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies: allow anonymous insert (no auth yet), and public read
-- tool_history
ALTER TABLE public.tool_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON public.tool_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON public.tool_history FOR SELECT USING (true);
CREATE POLICY "Allow public delete" ON public.tool_history FOR DELETE USING (true);
CREATE POLICY "Allow public update" ON public.tool_history FOR UPDATE USING (true);

-- saved_documents
ALTER TABLE public.saved_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON public.saved_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON public.saved_documents FOR SELECT USING (true);
CREATE POLICY "Allow public delete" ON public.saved_documents FOR DELETE USING (true);

-- shop_profiles
ALTER TABLE public.shop_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON public.shop_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON public.shop_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON public.shop_profiles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.shop_profiles FOR DELETE USING (true);

-- ai_media_history
ALTER TABLE public.ai_media_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON public.ai_media_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON public.ai_media_history FOR SELECT USING (true);
CREATE POLICY "Allow public delete" ON public.ai_media_history FOR DELETE USING (true);
