-- ============================================
-- My-Folio Builder: Community & Transactional Safety
-- ============================================

-- 1. 프로필 테이블 확장 (소셜 링크 및 가시성)
DO $$ 
BEGIN
    -- visibility 컬럼이 없으면 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='visibility') THEN
        ALTER TABLE profiles ADD COLUMN visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'friends_only', 'private'));
    END IF;

    -- github_url, linkedin_url은 이미 actions.ts에서 사용 중일 수 있으나 스키마 확인 후 추가
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='github_url') THEN
        ALTER TABLE profiles ADD COLUMN github_url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='linkedin_url') THEN
        ALTER TABLE profiles ADD COLUMN linkedin_url text;
    END IF;
END $$;

-- 2. 친구 관계 테이블 (Friedships)
CREATE TABLE IF NOT EXISTS friendships (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    requester_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- 이미 요청이 있거나 친구인 경우 중복 방지
    UNIQUE(requester_id, receiver_id)
);

-- RLS for friendships
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Friendships: select own" ON friendships FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Friendships: insert request" ON friendships FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Friendships: update own request" ON friendships FOR UPDATE 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Friendships: delete own request" ON friendships FOR DELETE 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- 3. [Transactional Safety] Resume 데이터 업데이트를 위한 RPC 함수
-- 클라이언트에서 삭제/삽입을 따로 호출하지 않고 한 번에 처리하여 원자성(Atomicity) 보장
CREATE OR REPLACE FUNCTION update_resume_items(
    p_portfolio_id uuid,
    p_table_name text,
    p_items jsonb
) RETURNS void AS $$
DECLARE
    item jsonb;
BEGIN
    -- 1. 해당 테이블에서 해당 portfolio_id를 가진 모든 데이터 삭제
    -- (주의: p_table_name을 직접 사용하므로 SQL Injection 방지를 위해 internal로만 사용하거나 검증 필요)
    -- 여기서는 안전을 위해 하드코딩된 테이블 이름만 허용하도록 분기 처리
    IF p_table_name NOT IN ('work_experiences', 'educations', 'awards', 'certifications', 'language_certs') THEN
        RAISE EXCEPTION 'Invalid table name: %', p_table_name;
    END IF;

    EXECUTE format('DELETE FROM %I WHERE portfolio_id = %L', p_table_name, p_portfolio_id);

    -- 2. 새로운 데이터 삽입
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- 아이템에 portfolio_id 강제 삽입 및 id는 null 처리(새로 생성) 또는 유지
        -- ordinal_position으로 정렬하여 삽입 순서 보장
        EXECUTE format(
            'INSERT INTO %I (portfolio_id, %s) SELECT %L, %s FROM jsonb_populate_record(null::%I, %L)',
            p_table_name,
            (SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = p_table_name AND column_name NOT IN ('id', 'portfolio_id', 'created_at', 'updated_at')),
            p_portfolio_id,
            (SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = p_table_name AND column_name NOT IN ('id', 'portfolio_id', 'created_at', 'updated_at')),
            p_table_name,
            item
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
