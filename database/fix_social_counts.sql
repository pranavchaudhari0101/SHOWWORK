-- Fix Social Counts
-- Recalculates likes_count and saves_count for all projects based on actual rows

-- Update likes_count
UPDATE projects p
SET likes_count = (
    SELECT COUNT(*)
    FROM project_likes pl
    WHERE pl.project_id = p.id
);

-- Update saves_count
UPDATE projects p
SET saves_count = (
    SELECT COUNT(*)
    FROM project_saves ps
    WHERE ps.project_id = p.id
);
