-- Social Interaction Triggers
-- Updates projects table counts automatically when likes/saves happen

-- Function to handle likes count
-- Function to handle likes count (Self-healing)
CREATE OR REPLACE FUNCTION handle_project_like()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE projects 
        SET likes_count = (SELECT count(*) FROM project_likes WHERE project_id = NEW.project_id)
        WHERE id = NEW.project_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE projects 
        SET likes_count = (SELECT count(*) FROM project_likes WHERE project_id = OLD.project_id)
        WHERE id = OLD.project_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for likes
DROP TRIGGER IF EXISTS on_project_like ON project_likes;
CREATE TRIGGER on_project_like
    AFTER INSERT OR DELETE ON project_likes
    FOR EACH ROW EXECUTE FUNCTION handle_project_like();


-- Function to handle saves count (Self-healing)
CREATE OR REPLACE FUNCTION handle_project_save()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE projects 
        SET saves_count = (SELECT count(*) FROM project_saves WHERE project_id = NEW.project_id)
        WHERE id = NEW.project_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE projects 
        SET saves_count = (SELECT count(*) FROM project_saves WHERE project_id = OLD.project_id)
        WHERE id = OLD.project_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for saves
DROP TRIGGER IF EXISTS on_project_save ON project_saves;
CREATE TRIGGER on_project_save
    AFTER INSERT OR DELETE ON project_saves
    FOR EACH ROW EXECUTE FUNCTION handle_project_save();
