-- ============================================
-- My-Folio Builder Schema (Loosely Coupled)
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- [Table] Profiles
-- ============================================
create table profiles (
    id uuid primary key,  -- same as auth.users.id (managed by trigger)
    username text unique,
    full_name text,
    avatar_url text,
    website text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),

    constraint username_length check (char_length(username) >= 3)
);

-- ============================================
-- [Table] Portfolios
-- ============================================
create table portfolios (
    id uuid default gen_random_uuid() primary key,
    user_id uuid not null,  -- references profiles.id (no FK)
    slug text unique not null,
    title text,
    bio text,
    skills jsonb default '[]',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Index for faster user_id lookups
create index idx_portfolios_user_id on portfolios(user_id);

-- ============================================
-- [Table] Projects
-- ============================================
create table projects (
    id uuid default gen_random_uuid() primary key,
    portfolio_id uuid not null,  -- references portfolios.id (no FK)
    name text not null,
    description text,
    url text,
    image_url text,
    project_type text default 'toy' check (project_type in ('main', 'toy')),
    tech_stack jsonb default '[]',
    display_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Index for faster portfolio_id lookups
create index idx_projects_portfolio_id on projects(portfolio_id);

-- ============================================
-- [RLS] Row Level Security
-- ============================================

-- Profiles
alter table profiles enable row level security;
create policy "Profiles: public read" on profiles for select using (true);
create policy "Profiles: owner insert" on profiles for insert with check (auth.uid() = id);
create policy "Profiles: owner update" on profiles for update using (auth.uid() = id);

-- Portfolios
alter table portfolios enable row level security;
create policy "Portfolios: public read" on portfolios for select using (true);
create policy "Portfolios: owner insert" on portfolios for insert with check (auth.uid() = user_id);
create policy "Portfolios: owner update" on portfolios for update using (auth.uid() = user_id);
create policy "Portfolios: owner delete" on portfolios for delete using (auth.uid() = user_id);

-- Projects (validate via portfolios table)
alter table projects enable row level security;
create policy "Projects: public read" on projects for select using (true);
create policy "Projects: owner insert" on projects for insert with check (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Projects: owner update" on projects for update using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);
create policy "Projects: owner delete" on projects for delete using (
    exists (select 1 from portfolios where id = portfolio_id and user_id = auth.uid())
);

-- ============================================
-- [Trigger] Auto-create Profile on Signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, username)
    values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8))
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
