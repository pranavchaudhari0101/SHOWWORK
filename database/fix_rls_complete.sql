-- =====================================================
-- ShowWork Complete RLS Fix for Public Project Visibility
-- Run this in Supabase SQL Editor
-- =====================================================

-- This script fixes the P0 bug where published projects
-- are not visible to other users. The root cause is that
-- the original combined SELECT policy uses auth.uid()
-- which returns NULL for anonymous users, potentially
-- blocking access even for public projects.

-- =====================================================
-- STEP 1: Fix Projects Table RLS
-- =====================================================

-- Drop ALL existing policies on projects table
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Public projects viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (including anonymous) can view PUBLIC projects
-- This policy uses visibility check ONLY - no auth dependency
CREATE POLICY "anon_view_public_projects"
ON projects FOR SELECT
TO anon, authenticated
USING (visibility = 'PUBLIC');

-- Policy 2: Authenticated users can view their OWN projects (any visibility)
CREATE POLICY "owner_view_own_projects"
ON projects FOR SELECT
TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Policy 3: Users can insert their own projects
CREATE POLICY "owner_insert_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Policy 4: Users can update their own projects
CREATE POLICY "owner_update_projects"
ON projects FOR UPDATE
TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Policy 5: Users can delete their own projects
CREATE POLICY "owner_delete_projects"
ON projects FOR DELETE
TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- =====================================================
-- STEP 2: Ensure Profiles are Publicly Readable
-- =====================================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read"
ON profiles FOR SELECT
TO anon, authenticated
USING (true);

-- =====================================================
-- STEP 3: Fix project_skills for Public Access
-- =====================================================

DROP POLICY IF EXISTS "Project skills are public" ON project_skills;

CREATE POLICY "project_skills_public_read"
ON project_skills FOR SELECT
TO anon, authenticated
USING (true);

-- =====================================================
-- STEP 4: Fix project_images for Public Access
-- =====================================================

DROP POLICY IF EXISTS "Project images are public" ON project_images;

CREATE POLICY "project_images_public_read"
ON project_images FOR SELECT
TO anon, authenticated
USING (true);

-- =====================================================
-- STEP 5: Verify Storage Bucket is Public
-- =====================================================

-- Ensure project-images bucket exists and is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'project-images';

-- =====================================================
-- VERIFICATION QUERIES (Run these to confirm fix works)
-- =====================================================

-- Test 1: Check public projects are accessible anonymously
-- Run this while logged out of Supabase dashboard:
-- SELECT id, title, visibility FROM projects WHERE visibility = 'PUBLIC' LIMIT 5;

-- Test 2: List all policies on projects table
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'projects';

-- =====================================================
-- ROLLBACK (Only if something goes wrong)
-- =====================================================
-- If you need to rollback, re-run the original schema.sql
-- or restore from a backup.
