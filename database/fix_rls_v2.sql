-- =====================================================
-- ShowWork RLS Fix v2 - Permissive SELECT with App-Level Access Control
-- Run this in Supabase SQL Editor
-- =====================================================

-- This script implements the "fetch by ID first, then apply access rules" pattern
-- RLS allows SELECT for all projects, access control is enforced in application code

-- =====================================================
-- STEP 1: Drop ALL existing SELECT policies on projects table
-- =====================================================

DROP POLICY IF EXISTS "projects_select_policy" ON projects;
DROP POLICY IF EXISTS "anon_view_public_projects" ON projects;
DROP POLICY IF EXISTS "owner_view_own_projects" ON projects;
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Public projects viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "fetch_project_by_id" ON projects;

-- =====================================================
-- STEP 2: Create a SINGLE permissive SELECT policy
-- =====================================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow SELECT for any project - access control is handled in application code
-- This enables the "fetch by ID first, then apply access rules" pattern
CREATE POLICY "allow_select_all_projects"
ON projects FOR SELECT
TO anon, authenticated
USING (true);

-- =====================================================
-- STEP 3: Keep write operations restricted to owners only
-- =====================================================

-- Drop existing write policies first
DROP POLICY IF EXISTS "projects_insert_policy" ON projects;
DROP POLICY IF EXISTS "projects_update_policy" ON projects;
DROP POLICY IF EXISTS "projects_delete_policy" ON projects;
DROP POLICY IF EXISTS "owner_insert_projects" ON projects;
DROP POLICY IF EXISTS "owner_update_projects" ON projects;
DROP POLICY IF EXISTS "owner_delete_projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Policy: Users can insert their own projects
CREATE POLICY "owner_insert_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Policy: Users can update their own projects
CREATE POLICY "owner_update_projects"
ON projects FOR UPDATE
TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- Policy: Users can delete their own projects
CREATE POLICY "owner_delete_projects"
ON projects FOR DELETE
TO authenticated
USING (
    profile_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
    )
);

-- =====================================================
-- IMPORTANT: Access Control is handled in Application Code
-- =====================================================
-- The project detail page (app/project/[id]/page.tsx) checks:
-- 1. If visibility = 'PUBLIC' -> show to everyone
-- 2. If visibility = 'DRAFT' or 'PRIVATE' -> show only to owner
-- This pattern follows Instagram/GitHub architecture
