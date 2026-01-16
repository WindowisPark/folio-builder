-- ============================================
-- My-Folio Builder: M:N Relationship & Themes
-- ============================================

-- 1. Add user_id to projects to manage them as global assets
alter table projects add column user_id uuid;

-- Update existing projects' user_id from their parent portfolios
update projects p
set user_id = pf.user_id
from portfolios pf
where p.portfolio_id = pf.id;

-- 2. Create Junction Table for M:N Relationship
create table portfolio_projects (
    id uuid default gen_random_uuid() primary key,
    portfolio_id uuid not null,
    project_id uuid not null,
    display_type text default 'toy' check (display_type in ('main', 'toy')),
    display_order integer default 0,
    created_at timestamp with time zone default now(),
    
    -- Ensure same project isn't added twice to same portfolio
    unique(portfolio_id, project_id)
);

-- Migrating existing 1:N data to M:N
insert into portfolio_projects (portfolio_id, project_id, display_type, display_order)
select portfolio_id, id, project_type, display_order from projects;

-- 3. Cleanup: projects table no longer needs portfolio_id
-- (Optional: Keep it for a while or drop it)
-- alter table projects drop column portfolio_id;

-- 4. Add theme support to portfolios
alter table portfolios add column theme text default 'light' check (theme in ('light', 'dark', 'sepia'));

-- 5. RLS Policies for portfolio_projects
alter table portfolio_projects enable row level security;

create policy "PortfolioProjects: public read" on portfolio_projects for select using (true);
create policy "PortfolioProjects: owner insert" on portfolio_projects for insert with check (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "PortfolioProjects: owner update" on portfolio_projects for update using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "PortfolioProjects: owner delete" on portfolio_projects for delete using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);

-- RLS for Projects (User based)
drop policy if exists "Projects: public read" on projects;
drop policy if exists "Projects: owner insert" on projects;
drop policy if exists "Projects: owner update" on projects;
drop policy if exists "Projects: owner delete" on projects;

create policy "Projects: public read" on projects for select using (true);
create policy "Projects: owner insert" on projects for insert with check (auth.uid() = user_id);
create policy "Projects: owner update" on projects for update using (auth.uid() = user_id);
create policy "Projects: owner delete" on projects for delete using (auth.uid() = user_id);
