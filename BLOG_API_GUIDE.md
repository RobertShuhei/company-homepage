# Blog API Guide

Global Genex Inc. ブログ管理システムのAPI使用ガイド

## 概要

このAPIシステムは、AI生成ブログ記事の作成、編集、保存、公開を管理するために設計されています。Next.js API Routesを使用して実装されており、管理者認証によって保護されています。

## 認証

すべてのAPIエンドポイントには管理者認証が必要です。

### 認証方法
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### 環境変数設定
`.env.local` ファイルに以下を設定：
```
ADMIN_API_TOKEN=your-secure-admin-token-here
OPENAI_API_KEY=sk-your-openai-api-key
```

## API エンドポイント

### 1. ブログ記事生成

**POST** `/api/generate-blog`

AI (GPT-5) を使用してブログ記事を生成します。

#### リクエストボディ
```json
{
  "topic": "AI活用による製造業のDX推進",
  "referenceUrl": "https://example.com/reference-article",
  "keywords": "AI, 製造業, DX, デジタル変革",
  "instructions": "専門的でありながら親しみやすい文体で、実践的な内容を含めてください",
  "model": "gpt-5-mini",
  "currentLocale": "ja"
}
```

#### パラメータ
- `topic` (必須): ブログ記事のトピック・アウトライン
- `referenceUrl` (任意): 参考URL
- `keywords` (任意): SEOキーワード
- `instructions` (任意): AI向けの特別な指示
- `model` (任意): `gpt-5-nano` | `gpt-5-mini` | `gpt-5` (デフォルト: `gpt-5-nano`)
- `currentLocale` (必須): `ja` | `en` | `zh`

#### レスポンス例
```json
{
  "success": true,
  "content": "# AI活用による製造業のDX推進\n\n製造業界におけるデジタル変革...",
  "metadata": {
    "locale": "ja",
    "model": "gpt-5-mini",
    "topic": "AI活用による製造業のDX推進",
    "keywords": "AI, 製造業, DX, デジタル変革",
    "wordCount": 2543,
    "generatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

### 2. ブログ記事公開・保存

**POST** `/api/blog/publish`

編集後のブログ記事をデータベースに保存・公開します。

#### リクエストボディ
```json
{
  "title": "AI活用による製造業のDX推進：実践的アプローチ",
  "content": "# AI活用による製造業のDX推進：実践的アプローチ\n\n...",
  "originalContent": "# AI活用による製造業のDX推進\n\n...",
  "model": "gpt-5-mini",
  "keywords": "AI, 製造業, DX, デジタル変革",
  "referenceUrl": "https://example.com/reference",
  "instructions": "専門的でありながら親しみやすい文体で",
  "locale": "ja",
  "summary": "AI技術を活用した製造業のデジタル変革について解説",
  "tags": ["AI", "製造業", "DX", "テクノロジー"],
  "status": "published"
}
```

#### パラメータ
- `title` (必須): ブログ記事タイトル
- `content` (必須): 編集後の記事内容 (Markdown形式)
- `locale` (必須): `ja` | `en` | `zh`
- `originalContent` (任意): AI生成時の元の内容
- `model` (任意): 使用したAIモデル
- `keywords` (任意): SEOキーワード
- `referenceUrl` (任意): 参考URL
- `instructions` (任意): 生成時の指示
- `summary` (任意): 記事要約
- `tags` (任意): タグ配列
- `status` (任意): `draft` | `published` (デフォルト: `published`)

#### レスポンス例
```json
{
  "success": true,
  "id": 123,
  "slug": "ai-driven-manufacturing-dx-practical-approach",
  "message": "Blog post published successfully",
  "publishedAt": "2025-01-15T10:45:00.000Z",
  "url": "/blog/ai-driven-manufacturing-dx-practical-approach"
}
```

### 3. ブログ記事取得

**GET** `/api/blog`

保存されたブログ記事を取得します（管理者専用）。

#### クエリパラメータ
- `id`: 特定の記事IDを取得
- `language`: 言語フィルター (`ja` | `en` | `zh`)
- `status`: ステータスフィルター (`draft` | `published` | `archived`)
- `limit`: 取得件数制限 (1-100)
- `offset`: 取得開始位置

#### 使用例
```bash
# 全ての公開済み日本語記事を取得
GET /api/blog?language=ja&status=published&limit=10

# 特定の記事を取得
GET /api/blog?id=123
```

#### レスポンス例
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "title": "AI活用による製造業のDX推進：実践的アプローチ",
      "slug": "ai-driven-manufacturing-dx-practical-approach",
      "content": "# AI活用による製造業のDX推進：実践的アプローチ\n...",
      "language": "ja",
      "status": "published",
      "tags": ["AI", "製造業", "DX"],
      "publishedAt": "2025-01-15T10:45:00.000Z",
      "createdAt": "2025-01-15T10:45:00.000Z"
    }
  ],
  "count": 1,
  "filters": {
    "language": "ja",
    "status": "published",
    "limit": 10
  }
}
```

## データベーススキーマ

ブログ記事は SQLite データベースに保存されます：

```sql
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  original_content TEXT,
  summary TEXT,
  language TEXT NOT NULL DEFAULT 'ja',
  status TEXT NOT NULL DEFAULT 'draft',
  tags TEXT, -- JSON array
  meta_description TEXT,
  keywords TEXT,
  ai_model TEXT,
  reference_url TEXT,
  generation_instructions TEXT,
  author TEXT DEFAULT 'Global Genex Inc.',
  published_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, language)
);
```

## エラーハンドリング

### 認証エラー (401)
```json
{
  "success": false,
  "error": "Invalid authentication token",
  "message": "Authentication required for this endpoint"
}
```

### バリデーションエラー (400)
```json
{
  "success": false,
  "error": "Missing required fields: title, content, and locale are required"
}
```

### 重複エラー (409)
```json
{
  "success": false,
  "error": "A blog post with this title already exists in this language. Please use a different title or modify the existing post."
}
```

## 使用例

### cURLでの基本的な使用方法

```bash
# 管理者トークンを設定
ADMIN_TOKEN="your-secure-admin-token"

# 1. ブログ記事を生成
curl -X POST "http://localhost:3000/api/generate-blog" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "製造業におけるAI導入の成功事例",
    "keywords": "AI, 製造業, 成功事例, 効率化",
    "model": "gpt-5-mini",
    "currentLocale": "ja"
  }'

# 2. 生成されたコンテンツを編集後、公開
curl -X POST "http://localhost:3000/api/blog/publish" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "製造業におけるAI導入の成功事例：効率化の実現",
    "content": "編集後のマークダウンコンテンツ...",
    "locale": "ja",
    "model": "gpt-5-mini",
    "status": "published"
  }'

# 3. 公開済み記事を確認
curl -X GET "http://localhost:3000/api/blog?language=ja&status=published" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## セキュリティ

- すべてのAPIエンドポイントは管理者認証で保護
- 入力データの厳格なバリデーション
- SQLインジェクション対策済み
- 適切なエラーハンドリングによる情報漏洩防止
- レート制限推奨（Vercel/Cloudflareレベル）

## パフォーマンス最適化

- SQLiteによる高速ローカルデータベース
- インデックス最適化済み
- 適切なクエリパラメータ制限
- Next.js API Routes による効率的なサーバーサイド処理

---

このAPIシステムは Global Genex Inc. の企業ブログ管理の要件を満たすよう設計されています。追加の機能やカスタマイズが必要な場合は、開発チームにご相談ください。