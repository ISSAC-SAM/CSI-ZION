-- CSA Zion Church System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / ADMINS
CREATE TABLE admins (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'CONTENT_ADMIN', 'EVENT_ADMIN', 'AI_ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Row Level Security for Admins
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all admin profiles" ON admins FOR SELECT USING (auth.uid() IN (SELECT id FROM admins));

-- 2. DAILY VERSES
CREATE TABLE daily_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publish_date DATE NOT NULL UNIQUE,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    english_text TEXT NOT NULL,
    tamil_text TEXT,
    reference TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE daily_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published verses" ON daily_verses FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage verses" ON daily_verses FOR ALL USING (auth.uid() IN (SELECT id FROM admins));

-- 3. EVENTS
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_ta TEXT,
    description_en TEXT,
    description_ta TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    service_type TEXT NOT NULL,
    person_name TEXT,
    location TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (auth.uid() IN (SELECT id FROM admins));

-- 4. CHURCH MEMBERS
CREATE TABLE church_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_ta TEXT,
    position TEXT NOT NULL,
    photo_url TEXT,
    qualification TEXT,
    experience TEXT,
    biography_en TEXT,
    biography_ta TEXT,
    phone TEXT,
    email TEXT,
    show_phone BOOLEAN DEFAULT false,
    show_email BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active members" ON church_members FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage members" ON church_members FOR ALL USING (auth.uid() IN (SELECT id FROM admins));

-- 5. AI KNOWLEDGE BASE (Documents)
CREATE TABLE ai_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'ready', 'failed')),
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE
);
ALTER TABLE ai_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only AI_ADMIN and SUPER_ADMIN can manage AI documents" ON ai_documents FOR ALL USING (
    EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid() AND admins.role IN ('SUPER_ADMIN', 'AI_ADMIN'))
);

-- 6. ACTIVITY LOGS
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admins(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view logs" ON activity_logs FOR SELECT USING (auth.uid() IN (SELECT id FROM admins));

-- Media/Storage integration rule placeholder: 
-- In Supabase Storage, create a bucket named 'csa_zion_media' and set policies similar to row level security.
