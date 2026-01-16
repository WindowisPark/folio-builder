-- ==========================================
-- SUPABASE STORAGE SETUP
-- ==========================================

-- 1. project-images 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies for project-images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- 2. 이미지 조회를 위해 모든 사용자(익명 포함)에게 읽기 권한 부여
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );

-- 3. 인증된 사용자가 본인의 이미지를 업로드할 수 있도록 허용
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images'
  AND (auth.role() = 'authenticated')
);

-- 4. 본인이 올린 이미지만 수정/삭제 가능하도록 설정
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'project-images' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'project-images' AND auth.uid() = owner );

-- ==========================================
-- 5. resume-proofs 버킷 생성 (자격증 증빙 서류)
-- ==========================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('resume-proofs', 'resume-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies for resume-proofs
DROP POLICY IF EXISTS "Public Access Proofs" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Proofs" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Proofs" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Proofs" ON storage.objects;

CREATE POLICY "Public Access Proofs" ON storage.objects FOR SELECT USING (bucket_id = 'resume-proofs');
CREATE POLICY "Auth Upload Proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resume-proofs' AND (auth.role() = 'authenticated'));
CREATE POLICY "Auth Update Proofs" ON storage.objects FOR UPDATE USING (bucket_id = 'resume-proofs' AND auth.uid() = owner);
CREATE POLICY "Auth Delete Proofs" ON storage.objects FOR DELETE USING (bucket_id = 'resume-proofs' AND auth.uid() = owner);
