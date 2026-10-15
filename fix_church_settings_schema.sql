-- ============================================================
-- COMPLETE FIX: Add ALL missing columns to church_settings
-- Run this ONCE in Supabase SQL Editor → New Query → Run
-- ============================================================

ALTER TABLE church_settings
  -- Home Page Content (home-content route)
  ADD COLUMN IF NOT EXISTS hero_title_en TEXT,
  ADD COLUMN IF NOT EXISTS hero_title_ta TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle_en TEXT,
  ADD COLUMN IF NOT EXISTS hero_subtitle_ta TEXT,
  ADD COLUMN IF NOT EXISTS verse_text_en TEXT,
  ADD COLUMN IF NOT EXISTS verse_text_ta TEXT,
  ADD COLUMN IF NOT EXISTS verse_reference_en TEXT,
  ADD COLUMN IF NOT EXISTS verse_reference_ta TEXT,

  -- About Section Content (about-content route)
  ADD COLUMN IF NOT EXISTS about_title_en TEXT,
  ADD COLUMN IF NOT EXISTS about_title_ta TEXT,
  ADD COLUMN IF NOT EXISTS about_desc1_en TEXT,
  ADD COLUMN IF NOT EXISTS about_desc1_ta TEXT,
  ADD COLUMN IF NOT EXISTS about_desc2_en TEXT,
  ADD COLUMN IF NOT EXISTS about_desc2_ta TEXT,

  -- Sunday School Overview (sunday-content route)
  ADD COLUMN IF NOT EXISTS sunday_school_mission_en TEXT,
  ADD COLUMN IF NOT EXISTS sunday_school_mission_ta TEXT,
  ADD COLUMN IF NOT EXISTS sunday_school_schedule_en TEXT,
  ADD COLUMN IF NOT EXISTS sunday_school_schedule_ta TEXT,
  ADD COLUMN IF NOT EXISTS sunday_school_location_en TEXT,
  ADD COLUMN IF NOT EXISTS sunday_school_location_ta TEXT,

  -- Church Settings (settings route)
  ADD COLUMN IF NOT EXISTS office_hours_en TEXT;

-- Force Supabase PostgREST to reload the schema cache immediately
NOTIFY pgrst, 'reload schema';

-- Verify: run this SELECT to confirm all new columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'church_settings'
ORDER BY ordinal_position;
