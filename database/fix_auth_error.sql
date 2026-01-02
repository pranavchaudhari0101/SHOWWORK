-- Run this in Supabase SQL Editor to fix the "Database error saving new user"

-- 1. Ensure Categories table exists (Idempotent)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure Profiles table exists (Idempotent)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 3. Seed Categories (Safe to run multiple times)
INSERT INTO categories (slug, name, icon) VALUES
    ('software-engineer', 'Software Engineer', 'code'),
    ('frontend-developer', 'Frontend Developer', 'layout'),
    ('backend-developer', 'Backend Developer', 'server'),
    ('fullstack-developer', 'Full-Stack Developer', 'layers'),
    ('data-analyst', 'Data Analyst', 'bar-chart'),
    ('data-scientist', 'Data Scientist', 'line-chart'),
    ('devops-engineer', 'DevOps Engineer', 'git-branch'),
    ('cybersecurity-analyst', 'Cybersecurity Analyst', 'shield'),
    ('ux-ui-designer', 'UX/UI Designer', 'figma'),
    ('ai-ml-engineer', 'AI/ML Engineer', 'brain'),
    ('cloud-engineer', 'Cloud Engineer', 'cloud'),
    ('mobile-developer', 'Mobile Developer', 'smartphone'),
    ('game-developer', 'Game Developer', 'gamepad-2'),
    ('blockchain-developer', 'Blockchain Developer', 'link')
ON CONFLICT (slug) DO NOTHING;

-- 4. Update the Trigger Function (The Fix)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    cat_id UUID;
BEGIN
    -- Try to find the category ID if provided
    IF NEW.raw_user_meta_data->>'category' IS NOT NULL THEN
        SELECT id INTO cat_id FROM categories WHERE slug = NEW.raw_user_meta_data->>'category';
    END IF;

    INSERT INTO profiles (user_id, username, full_name, category_id)
    VALUES (
        NEW.id,
        -- Use provided username, or fallback to email prefix
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        -- Use provided name, or fallback to 'User'
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            NEW.raw_user_meta_data->>'full_name',
            'User'
        ),
        cat_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Ensure Trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Enable RLS (Just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. Add RLS Policies if they don't exist (Drop first to avoid collision)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = user_id);
