-- Rollback M:N projects and theme changes

-- 1. Remove junction table
DROP TABLE IF EXISTS portfolio_projects;

-- 2. Remove theme column from portfolios
ALTER TABLE portfolios DROP COLUMN IF EXISTS theme;

-- 3. (Optional) If projects still have portfolio_id, we need to ensure it's correct.
-- In my implementation, I didn't actually remove portfolio_id from projects in the SQL, 
-- but I added user_id. We can keep user_id if we want, but let's restore the 1:N focus.

-- 4. Restore RLS for projects (1:N)
DROP POLICY IF EXISTS "Public can view projects" ON projects;
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;

-- Allow public read if they know the portfolio_id (basically public)
CREATE POLICY "Public can view projects" ON projects
    FOR SELECT USING (true);

-- Allow owners to manage
CREATE POLICY "Users can manage own projects" ON projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM portfolios
            WHERE portfolios.id = projects.portfolio_id
            AND portfolios.user_id = auth.uid()
        )
    );

-- 5. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
