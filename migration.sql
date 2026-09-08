-- Drop old tables if they exist to apply new schema
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS ai_documents CASCADE;
DROP TABLE IF EXISTS ai_faqs CASCADE;
DROP TABLE IF EXISTS church_members CASCADE;
DROP TABLE IF EXISTS sunday_school_teachers CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS gallery_categories CASCADE;
DROP TABLE IF EXISTS daily_verses CASCADE;
DROP TABLE IF EXISTS home_content CASCADE;
DROP TABLE IF EXISTS church_settings CASCADE;
DROP TABLE IF EXISTS bible_verses CASCADE;
DROP TABLE IF EXISTS bible_chapters CASCADE;
DROP TABLE IF EXISTS bible_books CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN');
$$;

-- 5. PROFILES TABLE
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'CHURCH_USER' CHECK (role IN ('ADMIN', 'CHURCH_USER')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_login_at TIMESTAMPTZ
);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Security Policies for profiles
CREATE POLICY "Public can view active profiles" ON profiles FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (is_admin());

-- 6. CHURCH SETTINGS
CREATE TABLE church_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_name_en TEXT,
    church_name_ta TEXT,
    address_en TEXT,
    address_ta TEXT,
    phone TEXT,
    email TEXT,
    mission_en TEXT,
    mission_ta TEXT,
    vision_en TEXT,
    vision_ta TEXT,
    about_en TEXT,
    about_ta TEXT,
    google_maps_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_church_settings_updated_at BEFORE UPDATE ON church_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE church_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON church_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON church_settings FOR ALL USING (is_admin());

-- 7. HOME CONTENT
CREATE TABLE home_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_title_en TEXT,
    hero_title_ta TEXT,
    hero_subtitle_en TEXT,
    hero_subtitle_ta TEXT,
    hero_image_url TEXT,
    about_title_en TEXT,
    about_title_ta TEXT,
    about_description_en TEXT,
    about_description_ta TEXT,
    about_image_url TEXT,
    mission_en TEXT,
    mission_ta TEXT,
    vision_en TEXT,
    vision_ta TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_home_content_updated_at BEFORE UPDATE ON home_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published home content" ON home_content FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage home content" ON home_content FOR ALL USING (is_admin());

-- 8. DAILY BIBLE VERSES
CREATE TABLE daily_verses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verse_date DATE UNIQUE NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse_start INTEGER NOT NULL,
    verse_end INTEGER,
    reference TEXT NOT NULL,
    english_text TEXT NOT NULL,
    tamil_text TEXT,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_daily_verses_updated_at BEFORE UPDATE ON daily_verses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_daily_verses_date ON daily_verses(verse_date);
CREATE INDEX idx_daily_verses_status ON daily_verses(status);
ALTER TABLE daily_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published verses" ON daily_verses FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage verses" ON daily_verses FOR ALL USING (is_admin());

-- 9. GALLERY
CREATE TABLE gallery_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_ta TEXT,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read gallery categories" ON gallery_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery categories" ON gallery_categories FOR ALL USING (is_admin());

CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT,
    title_ta TEXT,
    description_en TEXT,
    description_ta TEXT,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    category_id UUID REFERENCES gallery_categories(id) ON DELETE SET NULL,
    image_date DATE,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_gallery_category ON gallery(category_id);
CREATE INDEX idx_gallery_status ON gallery(status);
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published gallery" ON gallery FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage gallery" ON gallery FOR ALL USING (is_admin());

-- 10. EVENTS
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_ta TEXT,
    description_en TEXT,
    description_ta TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    service_type TEXT NOT NULL CHECK (service_type IN ('SUNDAY_SERVICE', 'FRIDAY_SERVICE', 'SATURDAY_SERVICE', 'PRAYER_MEETING', 'BIBLE_STUDY', 'YOUTH_MEETING', 'SPECIAL_PROGRAM', 'CHRISTMAS', 'EASTER', 'ANNIVERSARY', 'OTHER')),
    person_name_en TEXT,
    person_name_ta TEXT,
    location_en TEXT,
    location_ta TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published events" ON events FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (is_admin());

-- 11. ANNOUNCEMENTS
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_ta TEXT,
    description_en TEXT,
    description_ta TEXT,
    image_url TEXT,
    announcement_date DATE,
    priority TEXT DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'IMPORTANT', 'URGENT')),
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_announcements_status ON announcements(status);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published announcements" ON announcements FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL USING (is_admin());

-- 12. SUNDAY SCHOOL TEACHERS
CREATE TABLE sunday_school_teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_ta TEXT,
    photo_url TEXT,
    qualification_en TEXT,
    qualification_ta TEXT,
    experience TEXT,
    class_name_en TEXT,
    class_name_ta TEXT,
    description_en TEXT,
    description_ta TEXT,
    contact_number TEXT,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_sst_updated_at BEFORE UPDATE ON sunday_school_teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_sst_status ON sunday_school_teachers(status);
ALTER TABLE sunday_school_teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published teachers" ON sunday_school_teachers FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage teachers" ON sunday_school_teachers FOR ALL USING (is_admin());

-- 13. CHURCH MEMBERS / LEADERSHIP
CREATE TABLE church_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_ta TEXT,
    position TEXT NOT NULL CHECK (position IN ('PASTOR', 'ASSISTANT_PASTOR', 'PC_MEMBER', 'DC_MEMBER', 'SECRETARY', 'TREASURER', 'MEMBER')),
    photo_url TEXT,
    qualification_en TEXT,
    qualification_ta TEXT,
    experience TEXT,
    biography_en TEXT,
    biography_ta TEXT,
    phone TEXT,
    email TEXT,
    show_phone BOOLEAN DEFAULT false,
    show_email BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_cm_updated_at BEFORE UPDATE ON church_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_cm_status ON church_members(status);
CREATE INDEX idx_cm_position ON church_members(position);
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published church members" ON church_members FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage church members" ON church_members FOR ALL USING (is_admin());

-- 14. BIBLE LIBRARY
CREATE TABLE bible_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    testament TEXT NOT NULL CHECK (testament IN ('OT', 'NT')),
    book_number INTEGER,
    name_en TEXT NOT NULL,
    name_ta TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_bible_books_testament ON bible_books(testament);
ALTER TABLE bible_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view bible books" ON bible_books FOR SELECT USING (true);
CREATE POLICY "Admins can manage bible books" ON bible_books FOR ALL USING (is_admin());

CREATE TABLE bible_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES bible_books(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(book_id, chapter_number)
);
CREATE INDEX idx_bible_chapters_book ON bible_chapters(book_id);
ALTER TABLE bible_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view bible chapters" ON bible_chapters FOR SELECT USING (true);
CREATE POLICY "Admins can manage bible chapters" ON bible_chapters FOR ALL USING (is_admin());

CREATE TABLE bible_verses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES bible_chapters(id) ON DELETE CASCADE,
    verse_number INTEGER NOT NULL,
    english_text TEXT,
    tamil_text TEXT,
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(chapter_id, verse_number)
);
CREATE TRIGGER update_bible_verses_updated_at BEFORE UPDATE ON bible_verses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_bible_verses_chapter ON bible_verses(chapter_id);
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view bible verses" ON bible_verses FOR SELECT USING (true);
CREATE POLICY "Admins can manage bible verses" ON bible_verses FOR ALL USING (is_admin());

-- 15. AI KNOWLEDGE BASE
CREATE TABLE ai_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('BIBLE', 'CHURCH_INFORMATION', 'CHURCH_HISTORY', 'SERMON', 'SUNDAY_SCHOOL', 'PRAYER', 'BIBLE_STUDY', 'FAQ', 'OTHER')),
    storage_path TEXT,
    file_url TEXT,
    mime_type TEXT,
    file_size BIGINT,
    processing_status TEXT DEFAULT 'UPLOADED' CHECK (processing_status IN ('UPLOADED', 'PROCESSING', 'READY', 'FAILED')),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_ai_documents_updated_at BEFORE UPDATE ON ai_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE ai_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage AI documents" ON ai_documents FOR ALL USING (is_admin());

-- 16. AI FAQ
CREATE TABLE ai_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_en TEXT NOT NULL,
    question_ta TEXT,
    answer_en TEXT NOT NULL,
    answer_ta TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_ai_faqs_updated_at BEFORE UPDATE ON ai_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE ai_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage AI faqs" ON ai_faqs FOR ALL USING (is_admin());

-- 17. MEDIA
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    mime_type TEXT,
    file_size BIGINT,
    category TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage media" ON media FOR ALL USING (is_admin());

-- 18. ACTIVITY LOGS
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view activity logs" ON activity_logs FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert activity logs" ON activity_logs FOR INSERT WITH CHECK (is_admin());

-- Ensure my previously inserted admin user exists in the profiles table
INSERT INTO profiles (id, username, full_name, email, role, status)
VALUES (
    'ccef91f8-7c5d-4062-989e-9df6214f0cca', 
    'admin1', 
    'System Admin', 
    'admin@csizionchurch.org', 
    'ADMIN', 
    'ACTIVE'
) ON CONFLICT DO NOTHING;


 - -   1 2 .   C O N T A C T   M E S S A G E S 
 C R E A T E   T A B L E   c o n t a c t _ m e s s a g e s   ( 
         i d   U U I D   P R I M A R Y   K E Y   D E F A U L T   g e n _ r a n d o m _ u u i d ( ) , 
         n a m e   T E X T   N O T   N U L L , 
         e m a i l   T E X T , 
         p h o n e   T E X T , 
         m e s s a g e   T E X T   N O T   N U L L , 
         s t a t u s   T E X T   N O T   N U L L   D E F A U L T   ' N E W '   C H E C K   ( s t a t u s   I N   ( ' N E W ' ,   ' R E A D ' ,   ' R E S P O N D E D ' ) ) , 
         c r e a t e d _ a t   T I M E S T A M P T Z   D E F A U L T   n o w ( ) 
 ) ; 
 A L T E R   T A B L E   c o n t a c t _ m e s s a g e s   E N A B L E   R O W   L E V E L   S E C U R I T Y ; 
 C R E A T E   P O L I C Y   " P u b l i c   c a n   i n s e r t   m e s s a g e s "   O N   c o n t a c t _ m e s s a g e s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ; 
 C R E A T E   P O L I C Y   " A d m i n s   c a n   m a n a g e   m e s s a g e s "   O N   c o n t a c t _ m e s s a g e s   F O R   A L L   U S I N G   ( i s _ a d m i n ( ) ) ; 
  
 