-- ============================================================
-- SANDEEKA SECTIONS MIGRATION
-- Creates tables for Women Fellowship and Youth Fellowship
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ---------------------------------------------------------------
-- WOMEN FELLOWSHIP MEMBERS TABLE
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS women_fellowship_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_ta TEXT,
    photo_url TEXT,
    qualification_en TEXT,
    qualification_ta TEXT,
    position TEXT DEFAULT 'MEMBER' CHECK (position IN (
        'PRESIDENT',
        'VICE_PRESIDENT',
        'SECRETARY',
        'JOINT_SECRETARY',
        'TREASURER',
        'PRAYER_LEADER',
        'WORSHIP_LEADER',
        'EXECUTIVE_MEMBER',
        'MEMBER'
    )),
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_wfm_updated_at
    BEFORE UPDATE ON women_fellowship_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_wfm_status ON women_fellowship_members(status);
CREATE INDEX IF NOT EXISTS idx_wfm_position ON women_fellowship_members(position);

ALTER TABLE women_fellowship_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published women fellowship members"
    ON women_fellowship_members FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage women fellowship members"
    ON women_fellowship_members FOR ALL USING (is_admin());


-- ---------------------------------------------------------------
-- YOUTH FELLOWSHIP MEMBERS TABLE
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS youth_fellowship_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_ta TEXT,
    photo_url TEXT,
    qualification_en TEXT,
    qualification_ta TEXT,
    position TEXT DEFAULT 'MEMBER' CHECK (position IN (
        'PRESIDENT',
        'VICE_PRESIDENT',
        'SECRETARY',
        'JOINT_SECRETARY',
        'TREASURER',
        'PRAYER_LEADER',
        'WORSHIP_LEADER',
        'SPORTS_SECRETARY',
        'CULTURAL_SECRETARY',
        'EXECUTIVE_MEMBER',
        'MEMBER'
    )),
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_yfm_updated_at
    BEFORE UPDATE ON youth_fellowship_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_yfm_status ON youth_fellowship_members(status);
CREATE INDEX IF NOT EXISTS idx_yfm_position ON youth_fellowship_members(position);

ALTER TABLE youth_fellowship_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published youth fellowship members"
    ON youth_fellowship_members FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage youth fellowship members"
    ON youth_fellowship_members FOR ALL USING (is_admin());
