-- Run this in Supabase SQL Editor to fix the "Database error saving new user"

-- 1. Ensure Categories table exists
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure Profiles table exists
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    headline VARCHAR(200),
    bio TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    location VARCHAR(100),
    is_open_to_work BOOLEAN DEFAULT FALSE,
    github_url TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    twitter_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed Categories
INSERT INTO categories (slug, name, icon) VALUES
    ('fullstack', 'Full-Stack Developer', 'layers'),
    ('frontend', 'Frontend Developer', 'layout'),
    ('backend', 'Backend Developer', 'server'),
    ('ml', 'AI/ML Engineer', 'brain'),
    ('data', 'Data Scientist', 'line-chart'),
    ('mobile', 'Mobile Developer', 'smartphone'),
    ('devops', 'DevOps Engineer', 'git-branch'),
    ('design', 'UX/UI Designer', 'figma')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

-- 4. Update the Trigger Function (Robust Version)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    cat_id UUID;
    provided_username TEXT;
BEGIN
    -- Get username from metadata or email
    provided_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        SPLIT_PART(NEW.email, '@', 1)
    );

    -- Try to find the category ID if provided
    IF NEW.raw_user_meta_data->>'category' IS NOT NULL THEN
        SELECT id INTO cat_id FROM categories WHERE slug = NEW.raw_user_meta_data->>'category';
    END IF;

    INSERT INTO profiles (user_id, username, full_name, category_id)
    VALUES (
        NEW.id,
        provided_username,
        COALESCE(NEW.raw_user_meta_data->>'name', provided_username),
        cat_id
    );
    RETURN NEW;
END;
$$;

-- 5. Attach Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. Add RLS Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = user_id);
