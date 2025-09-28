#!/bin/bash

# Vercel環境変数設定スクリプト
# このスクリプトは手動実行用です

echo "🚀 Vercel環境変数設定を開始します..."

# Step 1: Vercelにログイン (手動で実行)
echo "Step 1: Vercelにログインしてください"
echo "コマンド: vercel login"
echo ""

# Step 2: プロジェクトをリンク (手動で実行)
echo "Step 2: プロジェクトをVercelにリンクしてください"
echo "コマンド: vercel link"
echo "- 既存のプロジェクトをリンクを選択"
echo "- ユーザー名/チーム名を選択"
echo "- 'company-homepage' プロジェクトを選択"
echo ""

# Step 3: 環境変数設定コマンド
echo "Step 3: 以下のコマンドで環境変数を設定してください"
echo ""
echo "# Supabase URL設定"
echo "vercel env add NEXT_PUBLIC_SUPABASE_URL production"
echo "# 値: https://ykunqdnulzadpdwyxxwt.supabase.co"
echo ""
echo "# Supabase Anon Key設定"
echo "vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production"
echo "# 値: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdW5xZG51bHphZHBkd3l4eHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwMzExNzUsImV4cCI6MjA3NDYwNzE3NX0.QfKuwQO3qTRwj5Bpv8PfO0Mw8IZ_hPLLcoWBNoRP4lw"
echo ""

# Step 4: デプロイの再実行
echo "Step 4: デプロイを再実行してください"
echo "コマンド: vercel --prod"
echo ""

echo "✅ 設定完了後、https://www.global-genex.com でSupabaseデータが正常に表示されることを確認してください"