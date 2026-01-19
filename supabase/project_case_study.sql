-- Add Case Study fields to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenges TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solutions TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS troubleshooting TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Update existing projects to have a default slug if name exists
UPDATE projects SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
