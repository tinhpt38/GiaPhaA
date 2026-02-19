-- Add missing columns to members table to match MemberForm
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS nickname text,
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS posthumous_name text,
ADD COLUMN IF NOT EXISTS generation integer,
ADD COLUMN IF NOT EXISTS child_order integer,
ADD COLUMN IF NOT EXISTS marriage_date_solar date,
ADD COLUMN IF NOT EXISTS marriage_date_lunar jsonb,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS job text,
ADD COLUMN IF NOT EXISTS achievement text,
ADD COLUMN IF NOT EXISTS residence text,
ADD COLUMN IF NOT EXISTS birth_place text,
ADD COLUMN IF NOT EXISTS death_place text,
ADD COLUMN IF NOT EXISTS burial_place text,
ADD COLUMN IF NOT EXISTS father_name text,
ADD COLUMN IF NOT EXISTS mother_name text,
ADD COLUMN IF NOT EXISTS spouse_name text;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
