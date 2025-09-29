# Essential Development Commands

## Development Server
```bash
npm run dev          # Start development server (usually on localhost:3000)
```

## Build & Quality Checks
```bash
npm run build        # Production build (generates static pages)
npm run start        # Start production server
npm run lint         # ESLint code quality check
npm run test         # Run Vitest test suite
```

## Git Operations (Darwin/macOS)
```bash
git status           # Check working tree status
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push origin main # Push to remote main branch
```

## System Utilities (macOS)
```bash
ls -la               # List files with details
find . -name "*.ts"  # Find TypeScript files
grep -r "pattern"    # Search for pattern in files
cd path/to/dir       # Change directory
```

## Database Operations
```bash
# Supabase connection test (via curl)
curl -X GET "http://localhost:3000/api/blog/public?language=ja&limit=5"
```

## Environment Management
```bash
cp .env.example .env.local    # Create local environment file
# Edit .env.local with actual values for:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY  
# - OPENAI_API_KEY
# - ADMIN_API_TOKEN
```

## Blog System Testing
```bash
# Test AI blog generation (requires ADMIN_TOKEN)
curl -X POST "http://localhost:3000/api/generate-blog" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test Article","currentLocale":"ja","model":"gpt-5-nano"}'
```