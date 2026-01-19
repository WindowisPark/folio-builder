-- ============================================
-- Add Missing Foreign Keys for Relational Integrity
-- ============================================

-- First, ensure portfolios has a link to profiles
ALTER TABLE portfolios 
ADD CONSTRAINT fk_portfolios_profiles 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Projects to Portfolios
ALTER TABLE projects 
ADD CONSTRAINT fk_projects_portfolios 
FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE;

-- Projects to Profiles (for ownership check)
ALTER TABLE projects 
ADD CONSTRAINT fk_projects_profiles 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Work Experiences to Portfolios
ALTER TABLE work_experiences 
ADD CONSTRAINT fk_work_experiences_portfolios 
FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE;

-- Educations to Portfolios
ALTER TABLE educations 
ADD CONSTRAINT fk_educations_portfolios 
FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE;

-- Awards to Portfolios
ALTER TABLE awards 
ADD CONSTRAINT fk_awards_portfolios 
FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE;

-- Certifications to Portfolios
ALTER TABLE certifications 
ADD CONSTRAINT fk_certifications_portfolios 
FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE;

-- Language Certs to Portfolios
ALTER TABLE language_certs 
ADD CONSTRAINT fk_language_certs_portfolios 
FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE;
