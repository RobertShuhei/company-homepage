# Supabase セットアップガイド

Global Genex Inc. ブログシステムのSupabase統合設定ガイド

## 概要

このプロジェクトは、SQLiteからSupabase（PostgreSQL）に移行済みです。Supabaseを使用することで以下の利点があります：

- **本番環境対応**: クラウドベースの高可用性データベース
- **リアルタイム機能**: リアルタイムデータ同期（将来の拡張用）
- **認証システム**: 組み込み認証機能（将来の管理者認証改善）
- **自動バックアップ**: データベースの自動バックアップとリストア
- **管理ダッシュボード**: Web UIでのデータベース管理

## 1. Supabaseプロジェクト作成

### 1.1 Supabaseアカウント作成
1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ

### 1.2 新しいプロジェクト作成
1. ダッシュボードで「New Project」をクリック
2. 以下の設定を入力：
   - **Name**: `global-genex-blog`
   - **Database Password**: 強力なパスワードを生成・保存
   - **Region**: `Northeast Asia (Tokyo)` (パフォーマンス最適化)
3. 「Create new project」をクリック

## 2. データベースマイグレーション

### 2.1 SQLエディタでテーブル作成
1. Supabaseダッシュボードで「SQL Editor」を開く
2. `supabase/migrations/001_create_blog_posts.sql` の内容をコピー&ペースト
3. 「Run」をクリックしてマイグレーションを実行

### 2.2 Row Level Security (RLS) 設定確認
マイグレーションにより以下のRLSポリシーが自動設定されます：
- 認証済みユーザーは公開記事を閲覧可能
- 管理者は全ての記事を管理可能

## 3. 環境変数設定

### 3.1 Supabase認証情報取得
1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の値をコピー：
   - **Project URL**: `https://xxxxxxxxxx.supabase.co`
   - **Anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### 3.2 .env.local ファイル更新
```bash
# Supabase Configuration (Primary Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. MCP設定

### 4.1 .mcp.json 更新
MCPファイルは既に設定済みですが、環境変数を追加：

```json
{
  "mcpServers": {
    "supabase": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_URL": "https://your-project-id.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key-here"
      }
    }
  }
}
```

## 5. データ移行（SQLiteから）

既存のSQLiteデータを移行する場合：

### 5.1 既存データのエクスポート
```bash
# SQLiteからCSVエクスポート（データが存在する場合）
sqlite3 data/blog.db ".mode csv" ".headers on" ".output blog_posts.csv" "SELECT * FROM blog_posts;"
```

### 5.2 Supabaseへのインポート
1. Supabaseダッシュボードで「Table Editor」を開く
2. `blog_posts` テーブルを選択
3. 「Insert」→「Import data from CSV」でファイルをアップロード

## 6. APIテスト

### 6.1 依存関係インストール
```bash
npm install
```

### 6.2 開発サーバー起動
```bash
npm run dev
```

### 6.3 API接続テスト
```bash
# 管理者トークンを設定
ADMIN_TOKEN="your-secure-admin-token"

# Supabase接続テスト（ブログ記事生成）
curl -X POST "http://localhost:3000/api/generate-blog" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Supabase統合テスト",
    "currentLocale": "ja",
    "model": "gpt-5-nano"
  }'

# ブログ記事保存テスト
curl -X POST "http://localhost:3000/api/blog/publish" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Supabase統合テスト記事",
    "content": "# テスト記事\\n\\nSupabaseとの統合が正常に動作しています。",
    "locale": "ja",
    "status": "published"
  }'
```

## 7. 本番環境デプロイ

### 7.1 Vercel環境変数設定
Vercelダッシュボードで以下の環境変数を設定：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_API_TOKEN=your-secure-admin-token
OPENAI_API_KEY=sk-your-openai-key
```

### 7.2 デプロイ実行
```bash
git add .
git commit -m "feat: Add Supabase integration for blog system"
git push origin main
```

## 8. 管理・監視

### 8.1 Supabaseダッシュボード機能
- **Table Editor**: ブログ記事の直接編集
- **SQL Editor**: カスタムクエリ実行
- **Logs**: API実行ログの確認
- **Performance**: データベースパフォーマンス監視

### 8.2 ログ監視
```sql
-- 最新のブログ記事を確認
SELECT id, title, language, status, created_at
FROM blog_posts
ORDER BY created_at DESC
LIMIT 10;

-- 言語別記事数
SELECT language, status, COUNT(*) as count
FROM blog_posts
GROUP BY language, status;
```

## 9. トラブルシューティング

### 9.1 よくある問題

**接続エラー**: `Failed to get blog posts: FetchError`
- 環境変数の確認（URL, ANON_KEY）
- Supabaseプロジェクトの稼働状況確認

**権限エラー**: `Row Level Security violation`
- RLSポリシーの確認
- 認証トークンの確認

**データ型エラー**: `invalid input syntax for type uuid`
- UUIDフィールドの値確認
- データベーススキーマの確認

### 9.2 デバッグ方法
```javascript
// Supabase接続テスト
import { supabase } from '@/lib/supabase'

// コンソールでテスト
const testConnection = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('count(*)', { count: 'exact' })

  console.log('Connection test:', { data, error })
}
```

## 10. パフォーマンス最適化

### 10.1 インデックス最適化
```sql
-- 追加インデックス（必要に応じて）
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published_at
ON blog_posts(status, published_at DESC)
WHERE status = 'published';
```

### 10.2 クエリ最適化
- `select('*')` の代わりに必要なフィールドのみ選択
- 適切なフィルタリング条件の使用
- ページネーションの実装

## 11. セキュリティベストプラクティス

### 11.1 環境変数保護
- `.env.local` はGitにコミットしない
- 本番環境では環境変数の暗号化
- 定期的なAPIキーローテーション

### 11.2 データベースセキュリティ
- RLSポリシーの定期的な確認
- 不要なアクセス権限の削除
- 監査ログの確認

---

このセットアップガイドに従って、Global Genex Inc.のブログシステムにSupabaseを統合できます。追加の質問やサポートが必要な場合は、開発チームにお問い合わせください。