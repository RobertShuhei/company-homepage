/**
 * Contact form data structure matching the frontend
 */
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot: string;
  timestamp: number;
}

/**
 * Cloudflare Worker environment variables
 */
interface Env {
  RESEND_API_KEY: string;
  RECIPIENT_EMAIL: string;
}

/**
 * HTML escaping function to prevent XSS
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Rate limiting storage using Cloudflare KV-like in-memory cache
 * In production, you would use Cloudflare KV or Durable Objects
 */
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if IP is rate limited (5 requests per 15 minutes)
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  const existing = rateLimitCache.get(key);
  
  if (!existing || now > existing.resetTime) {
    // Reset or create new entry
    rateLimitCache.set(key, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return false;
  }
  
  if (existing.count >= 5) {
    return true;
  }
  
  // Increment count
  rateLimitCache.set(key, { ...existing, count: existing.count + 1 });
  return false;
}

/**
 * Type guard to check if data has the required contact form structure
 */
function isContactFormData(data: unknown): data is Record<string, unknown> {
  return data !== null && typeof data === 'object';
}

/**
 * Validate contact form data
 */
function validateContactData(data: unknown): { isValid: boolean; error?: string } {
  // First check if data is an object
  if (!isContactFormData(data)) {
    return { isValid: false, error: 'Invalid data format' };
  }

  // Check required fields
  if (!data.name || typeof data.name !== 'string') {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (!data.email || typeof data.email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!data.message || typeof data.message !== 'string') {
    return { isValid: false, error: 'Message is required' };
  }
  
  // Honeypot spam check
  if (data.honeypot && typeof data.honeypot === 'string' && data.honeypot.trim() !== '') {
    return { isValid: false, error: 'Spam detected' };
  }
  
  // Validate string lengths
  if (data.name.trim().length < 2 || data.name.trim().length > 100) {
    return { isValid: false, error: 'Name must be between 2 and 100 characters' };
  }
  
  if (data.message.trim().length < 10 || data.message.trim().length > 2000) {
    return { isValid: false, error: 'Message must be between 10 and 2000 characters' };
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  // Timing check (submissions too fast might be spam)
  if (data.timestamp && typeof data.timestamp === 'number') {
    const now = Date.now();
    const timeDiff = now - data.timestamp;
    if (timeDiff < 3000) { // Less than 3 seconds
      return { isValid: false, error: 'Submission too fast' };
    }
  }
  
  // Content filtering (basic spam detection)
  const spamPatterns = [
    /\b(?:viagra|cialis|pharmacy|casino|lottery|winner|congratulations)\b/i,
    /\$\d+/g, // Dollar amounts
    /https?:\/\//g // URLs
  ];
  
  const fullText = `${data.name} ${data.email} ${data.message}`.toLowerCase();
  for (const pattern of spamPatterns) {
    if (pattern.test(fullText)) {
      return { isValid: false, error: 'Content not allowed' };
    }
  }
  
  return { isValid: true };
}

/**
 * Send email via Resend API
 */
async function sendEmail(data: ContactFormData, env: Env): Promise<{ success: boolean; error?: string }> {
  const recipientEmail = env.RECIPIENT_EMAIL || 'info@global-genex.com';
  
  const emailPayload = {
    from: 'Contact Form <noreply@global-genex.com>',
    to: [recipientEmail],
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #0891b2; margin: 10px 0;">
        ${escapeHtml(data.message).replace(/\n/g, '<br>')}
      </div>
      <hr>
      <p><small>Submitted at: ${new Date().toISOString()}</small></p>
    `,
    text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Message: ${data.message}

Submitted at: ${new Date().toISOString()}
    `.trim(),
    reply_to: data.email,
  };
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API error: ${response.status} ${errorText}`);
    }
    
    // レスポンスの型を明示的に指定
    const result = await response.json() as { id: string };
    console.log('Email sent successfully:', result.id);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
}

/**
 * CORS headers for secure cross-origin requests
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://global-genex.com', // Replace with your domain
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

/**
 * Main Cloudflare Worker handler
 */
async function handleRequest(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow POST requests for form submissions
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    try {
      // Get client IP for rate limiting
      const clientIP = request.headers.get('CF-Connecting-IP') || 
                       request.headers.get('X-Forwarded-For') || 
                       'unknown';

      // Check rate limiting
      if (isRateLimited(clientIP)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Too many requests. Please try again later.' 
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Parse request body
      let requestData: unknown;
      try {
        requestData = await request.json();
      } catch {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid JSON format' 
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Validate the contact form data
      const validation = validateContactData(requestData);
      if (!validation.isValid) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: validation.error 
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Type-safe contact data (we know it's valid from validation)
      const validData = requestData as Record<string, unknown>;
      const contactData: ContactFormData = {
        name: (validData.name as string).trim(),
        email: (validData.email as string).trim(),
        message: (validData.message as string).trim(),
        honeypot: (validData.honeypot as string) || '',
        timestamp: (validData.timestamp as number) || Date.now(),
      };

      // Send email
      const emailResult = await sendEmail(contactData, env);
      
      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to send message. Please try again later.' 
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Success response
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Message sent successfully' 
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Internal server error' 
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
}

/**
 * Cloudflare Worker export
 */
export default {
  fetch: handleRequest,
};