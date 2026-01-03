-- Run this in Supabase SQL Editor to set up storage for project images

-- 1. Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload to project-images bucket
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- 3. Allow public read access to project images
CREATE POLICY "Public read access for project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- 4. Allow users to update their own uploads
CREATE POLICY "Users can update own project images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images' AND owner = auth.uid());

-- 5. Allow users to delete their own uploads
CREATE POLICY "Users can delete own project images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images' AND owner = auth.uid());
