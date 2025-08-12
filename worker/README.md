# Secure Contact Form API - Cloudflare Worker

This is a production-ready, secure contact form API built with Cloudflare Workers that handles form submissions with comprehensive spam protection and email delivery.

## Features

- **Security First**: Rate limiting, honeypot detection, input validation, and CORS protection
- **Spam Protection**: Multiple spam detection patterns and submission timing validation
- **Email Delivery**: Powered by Resend API for reliable email delivery
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Monitoring**: Built-in logging for security events and debugging
- **Performance**: Optimized for Cloudflare Workers edge computing

## Security Measures

### Rate Limiting
- Maximum 5 requests per 15-minute window per IP
- 1-hour block for repeated violations
- Enhanced penalties for spam attempts

### Spam Protection
- Honeypot fields to catch automated submissions
- Content pattern matching for common spam phrases
- Submission timing validation (minimum 3 seconds)
- URL density analysis

### Input Validation
- Strict field length limits
- Email format validation
- HTML escape for XSS prevention
- Required field validation

### CORS Protection
- Configurable allowed origins
- Proper preflight handling
- Secure headers

## Setup Instructions

### Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Resend Account**: Sign up at [resend.com](https://resend.com) for email delivery
3. **Node.js**: Version 18 or higher
4. **Wrangler CLI**: Cloudflare's command-line tool

### 1. Install Dependencies

```bash
cd worker
npm install
```

### 2. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 3. Login to Cloudflare

```bash
wrangler login
```

### 4. Create KV Namespace for Rate Limiting

```bash
# Create production KV namespace
wrangler kv:namespace create "RATE_LIMIT_KV"

# Create preview KV namespace for development
wrangler kv:namespace create "RATE_LIMIT_KV" --preview
```

Update the KV namespace IDs in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "your-production-kv-id-here"
preview_id = "your-preview-kv-id-here"
```

### 5. Set Environment Variables

Set the required secrets using Wrangler CLI:

```bash
# Set Resend API key
wrangler secret put RESEND_API_KEY
# Enter your Resend API key when prompted

# Set recipient email
wrangler secret put RECIPIENT_EMAIL
# Enter: info@global-genex.com

# For different environments
wrangler secret put RESEND_API_KEY --env production
wrangler secret put RECIPIENT_EMAIL --env production

wrangler secret put RESEND_API_KEY --env staging
wrangler secret put RECIPIENT_EMAIL --env staging
```

### 6. Configure Allowed Origins

Update `wrangler.toml` with your domain:

```toml
[env.production]
name = "company-contact-api"
vars = { ALLOWED_ORIGINS = "https://your-domain.com,https://www.your-domain.com" }

[env.staging]
name = "company-contact-api-staging"
vars = { ALLOWED_ORIGINS = "https://staging.your-domain.com,http://localhost:3002" }
```

### 7. Setup Resend Domain

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add and verify your domain (e.g., global-genex.com)
3. Add the required DNS records to your domain
4. Wait for verification to complete

### 8. Deploy the Worker

```bash
# Deploy to development environment
npm run deploy:development

# Deploy to staging environment
npm run deploy:staging

# Deploy to production environment
npm run deploy:production
```

### 9. Update Frontend Configuration

Update the API endpoint in your frontend component (`src/components/ContactForm.tsx`):

```typescript
const API_ENDPOINT = process.env.NODE_ENV === 'production' 
  ? 'https://company-contact-api.your-username.workers.dev'
  : 'https://company-contact-api-dev.your-username.workers.dev'
```

Replace `your-username` with your actual Cloudflare Workers subdomain.

### 10. Test the Implementation

```bash
# Test locally
npm run dev

# Test the deployed worker
curl -X POST https://company-contact-api-dev.your-username.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3002" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from the API setup.",
    "honeypot": "",
    "timestamp": '$(date +%s000)'
  }'
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | Your Resend API key for sending emails | Yes |
| `RECIPIENT_EMAIL` | Email address to receive contact form submissions | Yes |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins for CORS | Yes |

## Monitoring and Debugging

### View Worker Logs

```bash
# View real-time logs
wrangler tail

# View logs for specific environment
wrangler tail --env production
```

### Monitor Rate Limiting

```bash
# View KV storage (rate limiting data)
wrangler kv:key list --binding RATE_LIMIT_KV
```

### Common Issues and Solutions

#### 1. CORS Errors
- Ensure your domain is in the `ALLOWED_ORIGINS` environment variable
- Check that the Origin header is being sent by your frontend

#### 2. Email Not Sending
- Verify your Resend API key is correct
- Ensure your domain is verified in Resend
- Check the worker logs for email sending errors

#### 3. Rate Limiting Issues
- Verify KV namespace is properly configured
- Check that the binding name matches in `wrangler.toml`
- Monitor KV usage in Cloudflare dashboard

#### 4. Deployment Failures
- Ensure you're logged in with `wrangler login`
- Verify your account has the necessary permissions
- Check that all required environment variables are set

## Security Best Practices

1. **Regular Updates**: Keep dependencies and Wrangler CLI updated
2. **Monitor Logs**: Regularly check worker logs for security events
3. **Rate Limit Adjustment**: Monitor and adjust rate limits based on usage patterns
4. **Domain Verification**: Only allow trusted domains in CORS configuration
5. **API Key Rotation**: Regularly rotate your Resend API key

## Performance Optimization

1. **KV Cleanup**: Implement periodic cleanup of expired rate limit entries
2. **Response Caching**: Consider caching successful responses briefly
3. **Error Handling**: Ensure all error paths are optimized for speed
4. **Memory Usage**: Monitor worker memory usage and optimize if needed

## Support

For issues related to:
- **Cloudflare Workers**: Check [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/)
- **Resend API**: Check [Resend documentation](https://resend.com/docs)
- **This Implementation**: Review the code comments and error logs

## License

This project is licensed under the MIT License.