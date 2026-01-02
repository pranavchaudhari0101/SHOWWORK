-- =====================================================
-- ShowWork Database Schema for Supabase
-- PostgreSQL with Row Level Security
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
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

-- Education table
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    university VARCHAR(200) NOT NULL,
    degree VARCHAR(100),
    major VARCHAR(100),
    graduation_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile Skills junction table
CREATE TABLE profile_skills (
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, skill_id)
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    short_desc VARCHAR(200) NOT NULL,
    full_desc TEXT,
    cover_image_url TEXT,
    demo_video_url TEXT,
    github_url TEXT,
    live_url TEXT,
    project_type VARCHAR(20) DEFAULT 'WEB_APP',
    status VARCHAR(20) DEFAULT 'COMPLETED',
    visibility VARCHAR(20) DEFAULT 'PUBLIC',
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, slug)
);

-- Project Skills junction table
CREATE TABLE project_skills (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- Project Images table
CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Likes table
CREATE TABLE project_likes (
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (profile_id, project_id)
);

-- Project Saves table
CREATE TABLE project_saves (
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (profile_id, project_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_category ON profiles(category_id);
CREATE INDEX idx_projects_profile ON projects(profile_id);
CREATE INDEX idx_projects_visibility ON projects(visibility);
CREATE INDEX idx_projects_created ON projects(created_at DESC);
CREATE INDEX idx_projects_likes ON projects(likes_count DESC);
CREATE INDEX idx_projects_views ON projects(views_count DESC);
CREATE INDEX idx_project_skills_skill ON project_skills(skill_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Increment view count
CREATE OR REPLACE FUNCTION increment_views(project_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE projects SET views_count = views_count + 1 WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment like count
CREATE OR REPLACE FUNCTION increment_likes(project_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE projects SET likes_count = likes_count + 1 WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement like count
CREATE OR REPLACE FUNCTION decrement_likes(project_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE projects SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create profile on user signup
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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Public projects are viewable by everyone"
    ON projects FOR SELECT USING (visibility = 'PUBLIC' OR profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert own projects"
    ON projects FOR INSERT WITH CHECK (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update own projects"
    ON projects FOR UPDATE USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete own projects"
    ON projects FOR DELETE USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

-- Likes policies
CREATE POLICY "Likes are viewable by everyone"
    ON project_likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like"
    ON project_likes FOR INSERT WITH CHECK (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can unlike"
    ON project_likes FOR DELETE USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

-- Saves policies
CREATE POLICY "Users can view own saves"
    ON project_saves FOR SELECT USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can save projects"
    ON project_saves FOR INSERT WITH CHECK (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can unsave"
    ON project_saves FOR DELETE USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

-- Education policies
CREATE POLICY "Education is public"
    ON education FOR SELECT USING (true);

CREATE POLICY "Users can manage own education"
    ON education FOR ALL USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

-- Profile skills policies
CREATE POLICY "Profile skills are public"
    ON profile_skills FOR SELECT USING (true);

CREATE POLICY "Users can manage own skills"
    ON profile_skills FOR ALL USING (profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    ));

-- Project skills policies
CREATE POLICY "Project skills are public"
    ON project_skills FOR SELECT USING (true);

CREATE POLICY "Users can manage own project skills"
    ON project_skills FOR ALL USING (project_id IN (
        SELECT id FROM projects WHERE profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    ));

-- Project images policies
CREATE POLICY "Project images are public"
    ON project_images FOR SELECT USING (true);

CREATE POLICY "Users can manage own project images"
    ON project_images FOR ALL USING (project_id IN (
        SELECT id FROM projects WHERE profile_id IN (
            SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    ));

-- =====================================================
-- SEED DATA - Categories
-- =====================================================

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
    ('blockchain-developer', 'Blockchain Developer', 'link');

-- =====================================================
-- SEED DATA - Skills
-- =====================================================

INSERT INTO skills (name) VALUES
    ('JavaScript'), ('TypeScript'), ('Python'), ('Java'), ('C++'),
    ('Go'), ('Rust'), ('Ruby'), ('PHP'), ('Swift'),
    ('Kotlin'), ('C#'), ('Scala'), ('R'),
    ('React'), ('Vue.js'), ('Angular'), ('Next.js'), ('Svelte'),
    ('Node.js'), ('Express'), ('Django'), ('Flask'), ('FastAPI'),
    ('Spring Boot'), ('Ruby on Rails'), ('Laravel'),
    ('PostgreSQL'), ('MySQL'), ('MongoDB'), ('Redis'), ('Elasticsearch'),
    ('GraphQL'), ('REST API'), ('gRPC'),
    ('Docker'), ('Kubernetes'), ('Terraform'), ('AWS'), ('GCP'),
    ('Azure'), ('Vercel'), ('Netlify'),
    ('TensorFlow'), ('PyTorch'), ('scikit-learn'), ('Pandas'), ('NumPy'),
    ('React Native'), ('Flutter'), ('Swift UI'), ('Expo'),
    ('Figma'), ('Sketch'), ('Adobe XD'),
    ('Git'), ('GitHub Actions'), ('Jenkins'), ('CircleCI'),
    ('Tailwind CSS'), ('Sass'), ('CSS-in-JS'), ('Framer Motion');
