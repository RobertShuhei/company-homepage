# Task Completion Checklist

## Required Checks After Any Code Changes

### 1. Code Quality Verification
```bash
npm run lint         # ESLint - must pass with no errors
npm run build        # Next.js build - must generate all static pages successfully  
npm run test         # Vitest test suite - all tests must pass
```

### 2. TypeScript Compilation
```bash
npx tsc --noEmit     # TypeScript compilation check - zero errors required
```

### 3. Development Server Test
```bash
npm run dev          # Verify server starts without errors
# Check key pages manually:
# - Homepage: http://localhost:3000/ja
# - Contact: http://localhost:3000/ja/contact  
# - Admin: http://localhost:3000/ja/admin/generator
```

### 4. Production Build Verification
```bash
npm run build        # Should output "Route (pages)" for all static pages
npm run start        # Test production server startup
```

### 5. Security & Environment Check
- Verify no secrets in committed code
- Confirm .env.local is not tracked by git
- Test admin authentication (if admin features modified)
- Validate CORS and security headers

### 6. Internationalization Verification (if i18n changes made)
- Test all supported locales (ja, en, zh)
- Verify language switcher functionality
- Check locale-specific routing

### 7. Database Integration Test (if database changes made)
```bash
# Test Supabase connection
curl -X GET "http://localhost:3000/api/blog/public?language=ja&limit=1"
```

### 8. Accessibility Check (for UI changes)
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- ARIA labels and semantic HTML

## Critical Warnings
- **NEVER commit without passing linting**
- **NEVER deploy with TypeScript errors** 
- **ALWAYS test responsive design on multiple screen sizes**
- **VERIFY email functionality if contact form modified**

## Git Workflow
```bash
git add .
git commit -m "descriptive commit message"
# Only push after ALL checks pass
git push origin main
```

## Documentation Updates Required
- Update CLAUDE.md task log for significant features
- Update API documentation if endpoints modified
- Add memory files for new architectural patterns