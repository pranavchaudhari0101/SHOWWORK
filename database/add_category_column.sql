-- Add category column to projects table
-- Run this in Supabase SQL Editor

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('fullstack', 'frontend', 'backend', 'ml', 'mobile', 'devops', 'embedded', 'web3', 'game', 'security', 'data', 'uiux'));

-- Optional: Create an index for faster filtering
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Comment on column
COMMENT ON COLUMN projects.category IS 'Project specialization category for filtering';
