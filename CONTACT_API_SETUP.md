# Contact API Setup Guide

This guide walks you through setting up the secure contact form API for your company homepage.

## Quick Start

1. **Navigate to worker directory**
   ```bash
   cd worker
   npm install
   ```

2. **Install Wrangler CLI globally**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **Create KV namespace for rate limiting**
   ```bash
   wrangler kv:namespace create "RATE_LIMIT_KV"
   wrangler kv:namespace create "RATE_LIMIT_KV" --preview
   ```
   
   Update `wrangler.toml` with the returned namespace IDs.

4. **Sign up for Resend and verify domain**
   - Go to [resend.com](https://resend.com) and create account
   - Add your domain and verify with DNS records
   - Get your API key

5. **Set secrets**
   ```bash
   wrangler secret put RESEND_API_KEY
   wrangler secret put RECIPIENT_EMAIL
   ```

6. **Deploy**
   ```bash
   npm run deploy:development
   ```

7. **Update frontend API endpoint**
   
   In `src/components/ContactForm.tsx`, replace:
   ```typescript
   const API_ENDPOINT = process.env.NODE_ENV === 'production' 
     ? 'https://company-contact-api.your-username.workers.dev'
     : 'https://company-contact-api-dev.your-username.workers.dev'
   ```

## File Structure

```
worker/
├── src/
│   └── index.ts          # Main worker script
├── package.json          # Dependencies and scripts
├── wrangler.toml        # Cloudflare Workers configuration
├── tsconfig.json        # TypeScript configuration
├── README.md            # Detailed setup instructions
└── .env.example         # Environment variable template
```

## Frontend Integration

The contact form is now live at `/contact` with:
- Real-time validation
- Spam protection
- Success/error handling
- Accessibility features
- Mobile-responsive design

## Security Features

- ✅ Rate limiting (5 requests per 15 minutes)
- ✅ Honeypot spam detection
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Content filtering
- ✅ Timing-based bot detection
- ✅ XSS prevention

## Testing

Test your deployed API:

```bash
curl -X POST https://your-worker-url.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3002" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message",
    "honeypot": "",
    "timestamp": 1692000000000
  }'
```

## Production Deployment

1. Update allowed origins in `wrangler.toml`
2. Deploy to production: `npm run deploy:production`
3. Update frontend API endpoint
4. Test thoroughly

## Support

- Check `worker/README.md` for detailed documentation
- View logs: `wrangler tail`
- Monitor KV usage in Cloudflare dashboard