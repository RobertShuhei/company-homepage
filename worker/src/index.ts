/// <reference types="@cloudflare/workers-types" />

/**
 * Contact form data
 */
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot: string;
  timestamp: number;
}

/**
 * Worker Env
 */
interface Env {
  RESEND_API_KEY: string;
  RECIPIENT_EMAIL: string;
  ALLOWED_ORIGINS?: string; // 例: "https://global-genex.com,https://www.global-genex.com,http://localhost:3000"
}

/** HTML escape */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** in-memory rate limit (注意: 実運用は KV/DO 推奨) */
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  const existing = rateLimitCache.get(key);

  if (!existing || now > existing.resetTime) {
    rateLimitCache.set(key, { count: 1, resetTime: now + 15 * 60 * 1000 });
    return false;
  }
  if (existing.count >= 5) return true;

  rateLimitCache.set(key, { ...existing, count: existing.count + 1 });
  return false;
}

function isContactFormData(data: unknown): data is Record<string, unknown> {
  return data !== null && typeof data === 'object';
}

function validateContactData(data: unknown): { isValid: boolean; error?: string } {
  if (!isContactFormData(data)) return { isValid: false, error: 'Invalid data format' };

  if (!data.name || typeof data.name !== 'string') return { isValid: false, error: 'Name is required' };
  if (!data.email || typeof data.email !== 'string') return { isValid: false, error: 'Email is required' };
  if (!data.message || typeof data.message !== 'string') return { isValid: false, error: 'Message is required' };

  if (data.honeypot && typeof data.honeypot === 'string' && data.honeypot.trim() !== '') {
    return { isValid: false, error: 'Spam detected' };
  }

  if (data.name.trim().length < 2 || data.name.trim().length > 100)
    return { isValid: false, error: 'Name must be between 2 and 100 characters' };

  if (data.message.trim().length < 10 || data.message.trim().length > 2000)
    return { isValid: false, error: 'Message must be between 10 and 2000 characters' };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test((data.email as string).trim())) return { isValid: false, error: 'Invalid email format' };

  if (data.timestamp && typeof data.timestamp === 'number') {
    const now = Date.now();
    const timeDiff = now - data.timestamp;
    if (timeDiff < 3000) return { isValid: false, error: 'Submission too fast' };
  }

  const spamPatterns = [
    /\b(?:viagra|cialis|pharmacy|casino|lottery|winner|congratulations)\b/i,
    /\$\d+/g,
    /https?:\/\//g,
  ];
  const fullText = `${data.name} ${data.email} ${data.message}`.toLowerCase();
  for (const pattern of spamPatterns) if (pattern.test(fullText)) return { isValid: false, error: 'Content not allowed' };

  return { isValid: true };
}

/** Send via Resend */
async function sendEmail(data: ContactFormData, env: Env): Promise<{ success: boolean; error?: string }> {
  const recipientEmail = env.RECIPIENT_EMAIL || 'info@global-genex.com';

  const emailPayload = {
    from: 'Contact Form <noreply@mail.global-genex.com>',
    to: [recipientEmail],
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Message:</strong></p>
      <div style="background:#f5f5f5;padding:15px;border-left:4px solid #0891b2;margin:10px 0;">
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
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API error: ${response.status} ${errorText}`);
    }

    const result = (await response.json()) as { id: string };
    console.log('Email sent successfully:', result.id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown email error' };
  }
}

/** CORS: 環境変数 ALLOWED_ORIGINS をホワイトリストとして使用 */
function makeCorsHeaders(origin: string | null, env: Env) {
  const allowed = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : ['https://global-genex.com'];
  const allow = origin && allowed.includes(origin) ? origin : allowed[0] ?? '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

/** Main handler */
async function handleRequest(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin');
  const corsHeaders = makeCorsHeaders(origin, env);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // GET を 200 に（ブラウザで直接叩いたときの確認用）
  if (request.method === 'GET') {
    return new Response(JSON.stringify({ status: 'Contact API is running' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const clientIP =
      request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';

    if (isRateLimited(clientIP)) {
      return new Response(JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    let requestData: unknown;
    try {
      requestData = await request.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const validation = validateContactData(requestData);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ success: false, error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const v = requestData as Record<string, unknown>;
    const contactData: ContactFormData = {
      name: (v.name as string).trim(),
      email: (v.email as string).trim(),
      message: (v.message as string).trim(),
      honeypot: (v.honeypot as string) || '',
      timestamp: (v.timestamp as number) || Date.now(),
    };

    const emailResult = await sendEmail(contactData, env);
    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to send message. Please try again later.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Worker error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

export default { fetch: handleRequest };
