# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled with `"strict": true` in tsconfig.json
- **Type Safety**: All functions and variables properly typed
- **Interface Definitions**: Comprehensive interfaces for data structures
- **No Any Types**: Avoid `any`, use `unknown` with type guards instead

## File Structure Conventions
- **App Router**: Using Next.js 15 App Router structure (`src/app/`)
- **Internationalization**: `[locale]` dynamic routes for i18n
- **Component Organization**: 
  - `src/components/ui/` - Reusable UI components
  - `src/components/layout/` - Layout components (Header, Footer)
  - `src/lib/` - Utility functions and shared logic
- **API Routes**: RESTful structure in `src/app/api/`

## Naming Conventions
- **Files**: kebab-case for pages, PascalCase for components
- **Components**: PascalCase (e.g., `ContactForm.tsx`, `Hero.tsx`)
- **Functions**: camelCase (e.g., `generateBlogPost`, `validateForm`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ADMIN_API_TOKEN`)
- **CSS Classes**: Tailwind utility classes, BEM methodology for custom CSS

## Component Structure
```typescript
// Standard React component pattern
import { useTranslations } from '@/lib/hooks/useTranslations'

interface ComponentProps {
  title: string
  locale: string
}

export default function Component({ title, locale }: ComponentProps) {
  const t = useTranslations(locale)
  
  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  )
}
```

## CSS/Styling Guidelines
- **Tailwind CSS**: Primary styling framework
- **Design System**: Consistent color palette and spacing
  - Primary: Deep Navy Blue (#1e3a5f)
  - Secondary: Professional Teal (#0891b2)  
  - Neutral: Warm Gray (#64748b)
- **Responsive Design**: Mobile-first approach with sm:, md:, lg: breakpoints
- **Typography**: Inter font family throughout

## Error Handling Patterns
```typescript
// API route error handling
try {
  const result = await operation()
  return NextResponse.json({ success: true, data: result })
} catch (error) {
  console.error('Operation failed:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

## Security Best Practices
- **Environment Variables**: Never commit secrets, use .env.local
- **Input Validation**: Validate all user inputs on both client and server
- **Authentication**: Bearer token validation for admin endpoints
- **XSS Prevention**: Proper sanitization of user content
- **HTTPS**: All production traffic over HTTPS