-- ============================================
-- Resume & Career History Tables (Maintenance-friendly)
-- ============================================

-- 1. [Table] Work Experiences
create table if not exists work_experiences (
    id uuid default gen_random_uuid() primary key,
    portfolio_id uuid not null,
    company_name text not null,
    role text not null,
    start_date date not null,
    end_date date,
    is_current boolean default false,
    description text,
    display_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 2. [Table] Educations
create table if not exists educations (
    id uuid default gen_random_uuid() primary key,
    portfolio_id uuid not null,
    school_name text not null,
    degree text,
    major text,
    start_date date not null,
    end_date date,
    is_current boolean default false,
    display_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
-- Ensure status column exists in educations
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name='educations' and column_name='status') then
        alter table educations add column status text;
    end if;
end $$;

-- 3. [Table] Awards
create table if not exists awards (
    id uuid default gen_random_uuid() primary key,
    portfolio_id uuid not null,
    title text not null,
    issuer text,
    date date not null,
    description text,
    display_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 4. [Table] Certifications
create table if not exists certifications (
    id uuid default gen_random_uuid() primary key,
    portfolio_id uuid not null,
    name text not null,
    issuer text,
    date date not null,
    credential_url text,
    display_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Ensure file_url column exists in certifications
do $$ 
begin
    if not exists (select 1 from information_schema.columns where table_name='certifications' and column_name='file_url') then
        alter table certifications add column file_url text;
    end if;
end $$;

-- 5. [Table] Language Certifications
create table if not exists language_certs (
    id uuid default gen_random_uuid() primary key,
    portfolio_id uuid not null,
    language text not null,
    test_name text not null,
    score text,
    date date not null,
    file_url text,
    display_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ============================================
-- [Indexes] Improve lookup performance
-- ============================================
create index if not exists idx_work_exp_portfolio_id on work_experiences(portfolio_id);
create index if not exists idx_edu_portfolio_id on educations(portfolio_id);
create index if not exists idx_awards_portfolio_id on awards(portfolio_id);
create index if not exists idx_certs_portfolio_id on certifications(portfolio_id);
create index if not exists idx_lang_certs_portfolio_id on language_certs(portfolio_id);

-- ============================================
-- [RLS] Row Level Security
-- ============================================

-- Enable RLS for all new tables
alter table work_experiences enable row level security;
alter table educations enable row level security;
alter table awards enable row level security;
alter table certifications enable row level security;
alter table language_certs enable row level security;

-- Drop existing policies to avoid conflicts when re-running
drop policy if exists "Work Experience: public read" on work_experiences;
drop policy if exists "Work Experience: owner insert" on work_experiences;
drop policy if exists "Work Experience: owner update" on work_experiences;
drop policy if exists "Work Experience: owner delete" on work_experiences;

drop policy if exists "Educations: public read" on educations;
drop policy if exists "Educations: owner insert" on educations;
drop policy if exists "Educations: owner update" on educations;
drop policy if exists "Educations: owner delete" on educations;

drop policy if exists "Awards: public read" on awards;
drop policy if exists "Awards: owner insert" on awards;
drop policy if exists "Awards: owner update" on awards;
drop policy if exists "Awards: owner delete" on awards;

drop policy if exists "Certifications: public read" on certifications;
drop policy if exists "Certifications: owner insert" on certifications;
drop policy if exists "Certifications: owner update" on certifications;
drop policy if exists "Certifications: owner delete" on certifications;

drop policy if exists "Language Certs: public read" on language_certs;
drop policy if exists "Language Certs: owner insert" on language_certs;
drop policy if exists "Language Certs: owner update" on language_certs;
drop policy if exists "Language Certs: owner delete" on language_certs;

-- Policies for work_experiences
create policy "Work Experience: public read" on work_experiences for select using (true);
create policy "Work Experience: owner insert" on work_experiences for insert with check (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Work Experience: owner update" on work_experiences for update using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Work Experience: owner delete" on work_experiences for delete using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);

-- Policies for educations
create policy "Educations: public read" on educations for select using (true);
create policy "Educations: owner insert" on educations for insert with check (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Educations: owner update" on educations for update using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Educations: owner delete" on educations for delete using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);

-- Policies for awards
create policy "Awards: public read" on awards for select using (true);
create policy "Awards: owner insert" on awards for insert with check (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Awards: owner update" on awards for update using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Awards: owner delete" on awards for delete using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);

-- Policies for certifications
create policy "Certifications: public read" on certifications for select using (true);
create policy "Certifications: owner insert" on certifications for insert with check (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Certifications: owner update" on certifications for update using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Certifications: owner delete" on certifications for delete using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);

-- Policies for language_certs
create policy "Language Certs: public read" on language_certs for select using (true);
create policy "Language Certs: owner insert" on language_certs for insert with check (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Language Certs: owner update" on language_certs for update using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Language Certs: owner delete" on language_certs for delete using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
