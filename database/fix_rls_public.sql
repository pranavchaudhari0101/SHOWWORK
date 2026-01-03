-- =====================================================
-- Fix RLS Policies for Public Project Visibility
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing policies on projects table
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view PUBLIC projects (no auth required)
CREATE POLICY "Public projects viewable by everyone"
ON projects FOR SELECT
USING (visibility = 'PUBLIC');

-- Policy 2: Users can view their own projects (any visibility)
CREATE POLICY "Users can view own projects"
ON projects FOR SELECT
TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Policy 3: Users can insert their own projects
CREATE POLICY "Users can insert own projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Policy 4: Users can update their own projects
CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Policy 5: Users can delete their own projects
CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE
TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- =====================================================
-- Also ensure profiles table has public read access
-- =====================================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);
