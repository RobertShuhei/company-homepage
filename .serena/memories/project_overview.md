# Global Genex Inc. Company Homepage Project Overview

## Project Purpose
Corporate homepage for Global Genex Inc. featuring:
- Marketing-focused website with landing page, business description, company profile
- Secure contact form with email confirmation system  
- Multi-language support (Japanese, English, Chinese)
- AI-powered blog functionality for content generation and management

## Current Status (Phase 3 Complete)
- **Phase 1**: Core marketing website with contact form (✓ Complete)
- **Phase 2**: Multi-language i18n implementation (✓ Complete) 
- **Phase 3**: AI-driven blog system with Supabase backend (✓ Complete)

## Tech Stack
- **Frontend**: Next.js 15.4.6 with App Router, React 19.1.0, TypeScript
- **Styling**: Tailwind CSS 3.4.0 with corporate design system
- **Database**: Supabase (PostgreSQL) for blog posts and data management
- **Authentication**: Bearer token system for admin access
- **AI Integration**: OpenAI GPT-5 (nano/mini/base models) for blog generation
- **Hosting**: Vercel with automatic deployments
- **Email**: Cloudflare Workers with Resend API for contact form processing
- **Analytics**: Google Analytics 4 integration
- **Testing**: Vitest with React Testing Library
- **Internationalization**: Custom i18n routing with locale detection

## Live URLs
- **Production Site**: https://www.global-genex.com
- **Contact API**: https://company-contact-api-production.global-genex.workers.dev
- **Admin Panel**: https://www.global-genex.com/ja/admin/generator (requires authentication)

## Key Features Implemented
- Corporate branding with Deep Navy Blue (#1e3a5f), Professional Teal (#0891b2), Warm Gray (#64748b)
- Responsive design with mobile-first approach
- WCAG 2.1 AA accessibility compliance
- SEO optimization with structured data, sitemaps, meta tags
- Secure contact form with dual-email system (notifications + confirmations)
- Multi-language routing with intelligent locale detection
- AI blog generation with customizable prompts and models
- Admin dashboard for blog management
- Public blog display with Markdown rendering