-- Blog Posts Database Schema for Global Genex Inc.
-- Supabase/PostgreSQL migration
-- This schema supports multilingual blog content with comprehensive metadata

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,

  -- Core Content Fields
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  original_content TEXT, -- AI-generated content before editing
  summary TEXT,

  -- Metadata
  language VARCHAR(5) NOT NULL DEFAULT 'ja', -- ja, en, zh
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, published, archived
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
  published_at TIMESTAMPTZ,

  -- Audit Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(slug, language), -- Each slug must be unique per language
  CHECK (status IN ('draft', 'published', 'archived')),
  CHECK (language IN ('ja', 'en', 'zh')),
  CHECK (ai_model IN ('gpt-5-nano', 'gpt-5-mini', 'gpt-5') OR ai_model IS NULL)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_lang ON blog_posts(slug, language);
CREATE INDEX IF NOT EXISTS idx_blog_posts_uuid ON blog_posts(uuid);

-- Function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all published posts
CREATE POLICY "Published posts are viewable by authenticated users" ON blog_posts
  FOR SELECT USING (status = 'published');

-- Policy for authenticated users to manage their own posts (admin use)
CREATE POLICY "Admin users can manage all posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data for testing
INSERT INTO blog_posts (
  title,
  slug,
  content,
  original_content,
  summary,
  language,
  status,
  tags,
  meta_description,
  ai_model,
  keywords,
  published_at
) VALUES (
  'AI活用による製造業の未来',
  'ai-driven-manufacturing-future',
  '# AI活用による製造業の未来

製造業界におけるAI技術の導入は、従来の製造プロセスを革新し、効率性と品質の向上をもたらしています。Global Genex Inc.では、お客様の製造業DXを支援するため、最新のAI技術動向を常に監視し、実践的なソリューションを提供しています。

## AIが変える製造現場

現代の製造業において、AIは以下の領域で大きな変革をもたらしています：

- **予知保全**: 機械学習アルゴリズムによる設備故障の事前予測
- **品質管理**: 画像認識技術による不良品の自動検出
- **生産最適化**: データ分析による生産計画の最適化
- **サプライチェーン**: 需要予測と在庫管理の自動化

## 導入における課題と解決策

AI導入には技術的・組織的な課題が存在しますが、適切なアプローチにより克服可能です：

### 技術的課題
1. データ品質の確保
2. システム統合の複雑性
3. セキュリティとプライバシー

### 組織的課題
1. 従業員のスキルアップ
2. 変革管理
3. ROIの測定

## Global Genexのアプローチ

私たちは段階的な導入アプローチを推奨しています：

1. **現状分析**: 既存プロセスの詳細な評価
2. **パイロット実施**: 小規模での概念実証
3. **段階的展開**: 成功事例をベースとした拡張
4. **継続改善**: データに基づく最適化

## まとめ

AI技術は製造業の競争力向上に不可欠な要素となっています。適切な戦略と実装により、生産性向上、コスト削減、品質向上を同時に実現できます。

Global Genex Inc.では、お客様の業界特性と企業文化に適したAIソリューションの設計・実装をサポートしています。製造業DXについてご相談がございましたら、お気軽にお問い合わせください。',
  '# AI活用による製造業の未来

製造業界におけるAI技術の導入は、従来の製造プロセスを革新し...',
  'AI技術が製造業界にもたらす変革について、Global Genex Inc.の専門家が詳しく解説します。予知保全、品質管理、生産最適化など、具体的な活用事例と導入アプローチを紹介。',
  'ja',
  'published',
  ARRAY['blog', 'AI', '製造業', 'DX', 'テクノロジー', 'デジタル変革'],
  'AI技術を活用した製造業の未来について、Global Genex Inc.の専門家が詳しく解説します。予知保全から品質管理まで、実践的なアプローチを紹介。',
  'gpt-5-mini',
  'AI, 製造業, DX, デジタル変革, 予知保全, 品質管理',
  NOW()
);

-- Grant necessary permissions for authenticated users
GRANT ALL ON blog_posts TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE blog_posts_id_seq TO authenticated;