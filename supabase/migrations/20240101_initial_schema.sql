-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. TABLES

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE NOT NULL,
    full_name text NOT NULL,
    email text,
    phone text,
    role text NOT NULL DEFAULT 'CHURCH_USER' CHECK (role IN ('ADMIN', 'CHURCH_USER')),
    status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_login_at timestamptz
);

-- CHURCH SETTINGS
CREATE TABLE IF NOT EXISTS public.church_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    church_name_en text,
    church_name_ta text,
    address_en text,
    address_ta text,
    phone text,
    email text,
    mission_en text,
    mission_ta text,
    vision_en text,
    vision_ta text,
    about_en text,
    about_ta text,
    google_maps_url text,
    facebook_url text,
    instagram_url text,
    youtube_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- HOME CONTENT
CREATE TABLE IF NOT EXISTS public.home_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_title_en text,
    hero_title_ta text,
    hero_subtitle_en text,
    hero_subtitle_ta text,
    hero_image_url text,
    about_title_en text,
    about_title_ta text,
    about_description_en text,
    about_description_ta text,
    about_image_url text,
    mission_en text,
    mission_ta text,
    vision_en text,
    vision_ta text,
    is_published boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- DAILY BIBLE VERSES
CREATE TABLE IF NOT EXISTS public.daily_verses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    verse_date date UNIQUE NOT NULL,
    book text NOT NULL,
    chapter integer NOT NULL,
    verse_start integer NOT NULL,
    verse_end integer,
    reference text NOT NULL,
    english_text text NOT NULL,
    tamil_text text,
    status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- GALLERY CATEGORIES
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en text NOT NULL,
    name_ta text,
    slug text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en text,
    title_ta text,
    description_en text,
    description_ta text,
    image_url text NOT NULL,
    storage_path text,
    category_id uuid REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
    image_date date,
    is_featured boolean DEFAULT false,
    status text DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en text NOT NULL,
    title_ta text,
    description_en text,
    description_ta text,
    event_date date NOT NULL,
    start_time time NOT NULL,
    end_time time,
    service_type text NOT NULL CHECK (service_type IN ('SUNDAY_SERVICE','FRIDAY_SERVICE','SATURDAY_SERVICE','PRAYER_MEETING','BIBLE_STUDY','YOUTH_MEETING','SPECIAL_PROGRAM','CHRISTMAS','EASTER','ANNIVERSARY','OTHER')),
    person_name_en text,
    person_name_ta text,
    location_en text,
    location_ta text,
    image_url text,
    status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CANCELLED')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en text NOT NULL,
    title_ta text,
    description_en text,
    description_ta text,
    image_url text,
    announcement_date date,
    priority text DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'IMPORTANT', 'URGENT')),
    status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- SUNDAY SCHOOL TEACHERS
CREATE TABLE IF NOT EXISTS public.sunday_school_teachers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en text NOT NULL,
    name_ta text,
    photo_url text,
    qualification_en text,
    qualification_ta text,
    experience text,
    class_name_en text,
    class_name_ta text,
    description_en text,
    description_ta text,
    contact_number text,
    display_order integer DEFAULT 0,
    status text DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- CHURCH MEMBERS / LEADERSHIP
CREATE TABLE IF NOT EXISTS public.church_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en text NOT NULL,
    name_ta text,
    position text NOT NULL CHECK (position IN ('PASTOR','ASSISTANT_PASTOR','PC_MEMBER','DC_MEMBER','SECRETARY','TREASURER')),
    photo_url text,
    qualification_en text,
    qualification_ta text,
    experience text,
    biography_en text,
    biography_ta text,
    phone text,
    email text,
    show_phone boolean DEFAULT false,
    show_email boolean DEFAULT false,
    display_order integer DEFAULT 0,
    status text DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- BIBLE BOOKS
CREATE TABLE IF NOT EXISTS public.bible_books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    testament text NOT NULL,
    book_number integer,
    name_en text NOT NULL,
    name_ta text,
    created_at timestamptz DEFAULT now()
);

-- BIBLE CHAPTERS
CREATE TABLE IF NOT EXISTS public.bible_chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id uuid NOT NULL REFERENCES public.bible_books(id) ON DELETE CASCADE,
    chapter_number integer NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(book_id, chapter_number)
);

-- BIBLE VERSES
CREATE TABLE IF NOT EXISTS public.bible_verses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id uuid NOT NULL REFERENCES public.bible_chapters(id) ON DELETE CASCADE,
    verse_number integer NOT NULL,
    english_text text,
    tamil_text text,
    reference text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(chapter_id, verse_number)
);

-- AI KNOWLEDGE BASE
CREATE TABLE IF NOT EXISTS public.ai_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    category text CHECK (category IN ('BIBLE','CHURCH_INFORMATION','CHURCH_HISTORY','SERMON','SUNDAY_SCHOOL','PRAYER','BIBLE_STUDY','FAQ','OTHER')),
    storage_path text,
    file_url text,
    mime_type text,
    file_size bigint,
    processing_status text DEFAULT 'UPLOADED' CHECK (processing_status IN ('UPLOADED','PROCESSING','READY','FAILED')),
    is_active boolean DEFAULT true,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- AI FAQs
CREATE TABLE IF NOT EXISTS public.ai_faqs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_en text NOT NULL,
    question_ta text,
    answer_en text NOT NULL,
    answer_ta text,
    category text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- MEDIA
CREATE TABLE IF NOT EXISTS public.media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name text NOT NULL,
    storage_path text NOT NULL,
    public_url text,
    mime_type text,
    file_size bigint,
    category text,
    uploaded_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- 4. TRIGGERS
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_church_settings_updated_at BEFORE UPDATE ON public.church_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_home_content_updated_at BEFORE UPDATE ON public.home_content FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_daily_verses_updated_at BEFORE UPDATE ON public.daily_verses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_sunday_school_teachers_updated_at BEFORE UPDATE ON public.sunday_school_teachers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_church_members_updated_at BEFORE UPDATE ON public.church_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_bible_verses_updated_at BEFORE UPDATE ON public.bible_verses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_ai_documents_updated_at BEFORE UPDATE ON public.ai_documents FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_ai_faqs_updated_at BEFORE UPDATE ON public.ai_faqs FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_daily_verses_date ON public.daily_verses(verse_date);
CREATE INDEX IF NOT EXISTS idx_daily_verses_status ON public.daily_verses(status);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_status ON public.gallery(status);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_church_members_status ON public.church_members(status);
CREATE INDEX IF NOT EXISTS idx_church_members_position ON public.church_members(position);
CREATE INDEX IF NOT EXISTS idx_sunday_school_teachers_status ON public.sunday_school_teachers(status);
CREATE INDEX IF NOT EXISTS idx_bible_books_testament ON public.bible_books(testament);
CREATE INDEX IF NOT EXISTS idx_bible_chapters_book ON public.bible_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_bible_verses_chapter ON public.bible_verses(chapter_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 6. ROW LEVEL SECURITY (RLS)

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN' AND status = 'ACTIVE'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunday_school_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;


-- Profiles: Users can read their own, Admins can read all. Admins can insert/update all.
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- Church Settings: Public can read, Admins can update.
CREATE POLICY "Public read church settings" ON public.church_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage church settings" ON public.church_settings FOR ALL USING (public.is_admin());

-- Home Content: Public can read published, Admins can manage.
CREATE POLICY "Public read published home content" ON public.home_content FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage home content" ON public.home_content FOR ALL USING (public.is_admin());

-- Daily Verses: Public can read published, Admins manage.
CREATE POLICY "Public read published verses" ON public.daily_verses FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins manage verses" ON public.daily_verses FOR ALL USING (public.is_admin());

-- Gallery Categories & Gallery: Public read published gallery.
CREATE POLICY "Public read gallery categories" ON public.gallery_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery categories" ON public.gallery_categories FOR ALL USING (public.is_admin());

CREATE POLICY "Public read published gallery images" ON public.gallery FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins manage gallery" ON public.gallery FOR ALL USING (public.is_admin());

-- Events
CREATE POLICY "Public read published events" ON public.events FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins manage events" ON public.events FOR ALL USING (public.is_admin());

-- Announcements
CREATE POLICY "Public read published announcements" ON public.announcements FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL USING (public.is_admin());

-- Sunday School
CREATE POLICY "Public read published teachers" ON public.sunday_school_teachers FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins manage teachers" ON public.sunday_school_teachers FOR ALL USING (public.is_admin());

-- Church Members
CREATE POLICY "Public read published members" ON public.church_members FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins manage members" ON public.church_members FOR ALL USING (public.is_admin());

-- Bible (Public read all since only approved supplied text is here)
CREATE POLICY "Public read bible books" ON public.bible_books FOR SELECT USING (true);
CREATE POLICY "Admins manage bible books" ON public.bible_books FOR ALL USING (public.is_admin());

CREATE POLICY "Public read bible chapters" ON public.bible_chapters FOR SELECT USING (true);
CREATE POLICY "Admins manage bible chapters" ON public.bible_chapters FOR ALL USING (public.is_admin());

CREATE POLICY "Public read bible verses" ON public.bible_verses FOR SELECT USING (true);
CREATE POLICY "Admins manage bible verses" ON public.bible_verses FOR ALL USING (public.is_admin());

-- AI Knowledge Base & FAQs (Protected)
-- Only Church Users and Admins can read FAQs and Documents (if active)
CREATE POLICY "Church Users read active AI documents" ON public.ai_documents FOR SELECT 
    USING (is_active = true AND auth.role() = 'authenticated');
CREATE POLICY "Admins manage AI documents" ON public.ai_documents FOR ALL USING (public.is_admin());

CREATE POLICY "Church Users read active AI FAQs" ON public.ai_faqs FOR SELECT 
    USING (is_active = true AND auth.role() = 'authenticated');
CREATE POLICY "Admins manage FAQs" ON public.ai_faqs FOR ALL USING (public.is_admin());

-- Media
CREATE POLICY "Admins manage media" ON public.media FOR ALL USING (public.is_admin());

-- Activity Logs
CREATE POLICY "Admins read activity logs" ON public.activity_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins insert logs" ON public.activity_logs FOR INSERT WITH CHECK (public.is_admin());

-- SEED DATA 
INSERT INTO public.gallery_categories (name_en, slug) VALUES 
('Church Services', 'church-services'),
('Youth Ministry', 'youth-ministry'),
('Sunday School', 'sunday-school'),
('Special Events', 'special-events') ON CONFLICT DO NOTHING;

-- STORAGE BUCKETS (Must be handled via Supabase API / SQL if possible)
-- Requires superuser/storage schema permissions which apply_migration might have.
INSERT INTO storage.buckets (id, name, public) VALUES 
('church-gallery', 'church-gallery', true),
('church-members', 'church-members', true),
('sunday-school', 'sunday-school', true),
('events', 'events', true),
('announcements', 'announcements', true),
('site-media', 'site-media', true),
('ai-documents', 'ai-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for church-gallery bucket as an example:
CREATE POLICY "Public read church-gallery" ON storage.objects FOR SELECT 
USING (bucket_id = 'church-gallery');
CREATE POLICY "Admins manage church-gallery" ON storage.objects FOR ALL 
USING (bucket_id = 'church-gallery' AND public.is_admin());

CREATE POLICY "Public read church-members" ON storage.objects FOR SELECT USING (bucket_id = 'church-members');
CREATE POLICY "Admins manage church-members" ON storage.objects FOR ALL USING (bucket_id = 'church-members' AND public.is_admin());

CREATE POLICY "Public read events" ON storage.objects FOR SELECT USING (bucket_id = 'events');
CREATE POLICY "Admins manage events" ON storage.objects FOR ALL USING (bucket_id = 'events' AND public.is_admin());
