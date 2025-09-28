-- Blog Posts Database Schema for Global Genex Inc.
-- This schema supports multilingual blog content with comprehensive metadata

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,

  -- Core Content Fields
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  original_content TEXT, -- AI-generated content before editing
  summary TEXT,

  -- Metadata
  language VARCHAR(5) NOT NULL DEFAULT 'ja', -- ja, en, zh
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, published, archived
  resource_category VARCHAR(20) DEFAULT 'blog', -- case-studies, white-papers, industry-insights, blog
  tags TEXT[], -- Array of tags for categorization

  -- SEO and Discovery
  meta_description TEXT,
  featured_image_url TEXT,
  keywords TEXT, -- SEO keywords used during generation

  -- Generation Metadata
  ai_model VARCHAR(50), -- gpt-5-nano, gpt-5-mini, gpt-5
  reference_url TEXT, -- Source URL used for generation
  generation_instructions TEXT, -- Custom instructions used

  -- Publishing Information
  author VARCHAR(100) DEFAULT 'Global Genex Inc.',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  UNIQUE(slug, language), -- Each slug must be unique per language
  CHECK (status IN ('draft', 'published', 'archived')),
  CHECK (language IN ('ja', 'en', 'zh')),
  CHECK (resource_category IN ('case-studies', 'white-papers', 'industry-insights', 'blog')),
  CHECK (ai_model IN ('gpt-5-nano', 'gpt-5-mini', 'gpt-5') OR ai_model IS NULL)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);
CREATE INDEX IF NOT EXISTS idx_blog_posts_resource_category ON blog_posts(resource_category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_lang ON blog_posts(slug, language);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_status_lang ON blog_posts(resource_category, status, language);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO blog_posts (
  title,
  slug,
  content,
  original_content,
  summary,
  language,
  status,
  resource_category,
  tags,
  meta_description,
  ai_model,
  keywords
) VALUES (
  'AI活用による製造業の未来',
  'ai-driven-manufacturing-future',
  '# AI活用による製造業の未来\n\n製造業界におけるAI技術の導入は...',
  '# AI活用による製造業の未来\n\n製造業界におけるAI技術の導入は...',
  'AI技術が製造業界にもたらす変革について解説します。',
  'ja',
  'published',
  'industry-insights',
  ARRAY['AI', '製造業', 'DX', 'テクノロジー'],
  'AI技術を活用した製造業の未来について、Global Genex Inc.の専門家が詳しく解説します。',
  'gpt-5-mini',
  'AI, 製造業, DX, デジタル変革'
);