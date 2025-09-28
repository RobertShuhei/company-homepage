-- Migration: Add Resource Category Column to Blog Posts
-- This migration adds a resource_category column to support categorizing blog posts
-- into Case Studies, White Papers, Industry Insights, and Blog posts

-- Add resource category column to blog_posts table
ALTER TABLE blog_posts
ADD COLUMN resource_category VARCHAR(20) DEFAULT 'blog'
CHECK (resource_category IN ('case-studies', 'white-papers', 'industry-insights', 'blog'));

-- Create index for category filtering performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_resource_category ON blog_posts(resource_category);

-- Create composite index for common queries (category + status + language)
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_status_lang ON blog_posts(resource_category, status, language);

-- Update existing posts to have 'blog' category as default
UPDATE blog_posts SET resource_category = 'blog' WHERE resource_category IS NULL;

-- Verify the migration
-- SELECT resource_category, COUNT(*) FROM blog_posts GROUP BY resource_category;