/// <reference types="@cloudflare/workers-types" />

/**
 * Contact form data
 */
interface ContactFormData {
  name: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  inquiryType: string;
  message: string;
  privacyConsent: boolean;
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

  // Required fields validation
  if (!data.name || typeof data.name !== 'string') return { isValid: false, error: 'Name is required' };
  if (!data.email || typeof data.email !== 'string') return { isValid: false, error: 'Email is required' };
  if (!data.message || typeof data.message !== 'string') return { isValid: false, error: 'Message is required' };
  if (!data.inquiryType || typeof data.inquiryType !== 'string') return { isValid: false, error: 'Inquiry type is required' };
  if (typeof data.privacyConsent !== 'boolean' || !data.privacyConsent) return { isValid: false, error: 'Privacy policy consent is required' };

  // Optional fields type validation
  if (data.companyName !== undefined && typeof data.companyName !== 'string') return { isValid: false, error: 'Invalid company name format' };
  if (data.phoneNumber !== undefined && typeof data.phoneNumber !== 'string') return { isValid: false, error: 'Invalid phone number format' };

  // Honeypot spam detection
  if (data.honeypot && typeof data.honeypot === 'string' && data.honeypot.trim() !== '') {
    return { isValid: false, error: 'Spam detected' };
  }

  // Field length validations
  if (data.name.trim().length < 2 || data.name.trim().length > 100)
    return { isValid: false, error: 'Name must be between 2 and 100 characters' };

  if (data.message.trim().length < 10 || data.message.trim().length > 2000)
    return { isValid: false, error: 'Message must be between 10 and 2000 characters' };

  // Optional company name length validation
  if (data.companyName && typeof data.companyName === 'string' && data.companyName.trim().length > 100)
    return { isValid: false, error: 'Company name must be less than 100 characters' };

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test((data.email as string).trim())) return { isValid: false, error: 'Invalid email format' };

  // Optional phone number format validation
  if (data.phoneNumber && typeof data.phoneNumber === 'string' && data.phoneNumber.trim() !== '') {
    const phoneRegex = /^[\+]?[\d]{8,15}$/;
    const cleanPhone = data.phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) return { isValid: false, error: 'Invalid phone number format' };
  }

  // Inquiry type validation
  const validInquiryTypes = ['Service Inquiry', 'Hiring', 'Partnership', 'General Support', 'Other'];
  if (!validInquiryTypes.includes(data.inquiryType)) return { isValid: false, error: 'Invalid inquiry type' };

  // Timing validation - allow current timestamps and reasonable delays, block old submissions
  if (data.timestamp && typeof data.timestamp === 'number') {
    const now = Date.now();
    const timeDiff = now - data.timestamp;
    
    // Block submissions that are too old (more than 5 minutes) or from the future
    if (timeDiff > 5 * 60 * 1000) return { isValid: false, error: 'Submission expired' };
    if (timeDiff < -30000) return { isValid: false, error: 'Invalid timestamp' };
    
    // Allow all submissions within reasonable time range (including current timestamps)
    // This removes the previous "too fast" protection that was blocking legitimate users
  }

  // Spam content detection
  const spamPatterns = [
    /\b(?:viagra|cialis|pharmacy|casino|lottery|winner|congratulations)\b/i,
    /\$\d+/g,
    /https?:\/\//g,
  ];
  const fullText = `${data.name} ${data.email} ${data.companyName || ''} ${data.message}`.toLowerCase();
  for (const pattern of spamPatterns) if (pattern.test(fullText)) return { isValid: false, error: 'Content not allowed' };

  return { isValid: true };
}

/** Send confirmation email to user */
async function sendConfirmationEmail(data: ContactFormData, env: Env): Promise<{ success: boolean; error?: string }> {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - Global Genex</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e3a5f; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1e3a5f 0%, #0891b2 100%); color: white; text-align: center; padding: 30px 20px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .highlight-box { background: #f0f9ff; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .contact-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .contact-summary h3 { color: #1e3a5f; margin-top: 0; }
        .next-steps { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #64748b; color: white; text-align: center; padding: 20px; font-size: 14px; }
        .footer a { color: #93c5fd; text-decoration: none; }
        .cta-box { background: #1e3a5f; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; }
        .cta-box a { color: #93c5fd; text-decoration: none; font-weight: 600; }
        @media only screen and (max-width: 600px) { .container { width: 100% !important; } .content { padding: 20px !important; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Thank You, ${escapeHtml(data.name)}!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your inquiry has been successfully received</p>
        </div>
        
        <div class="content">
            <div class="highlight-box">
                <h2 style="margin-top: 0; color: #0891b2;">📩 Inquiry Confirmed</h2>
                <p>We've received your <strong>${escapeHtml(data.inquiryType)}</strong> inquiry and our team will review it carefully. You can expect a personalized response within 24-48 hours during business days.</p>
            </div>

            <div class="contact-summary">
                <h3>📋 Your Submission Summary</h3>
                <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
                ${data.companyName ? `<p><strong>Company:</strong> ${escapeHtml(data.companyName)}</p>` : ''}
                <p><strong>Inquiry Type:</strong> ${escapeHtml(data.inquiryType)}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
            </div>

            <div class="next-steps">
                <h3 style="color: #059669; margin-top: 0;">⏰ What Happens Next?</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Immediate:</strong> Your inquiry is logged in our system</li>
                    <li><strong>Within 4 hours:</strong> Initial acknowledgment from our team</li>
                    <li><strong>Within 24-48 hours:</strong> Detailed response with next steps</li>
                    <li><strong>Follow-up:</strong> Scheduled call or meeting if needed</li>
                </ul>
            </div>

            <div class="cta-box">
                <h3 style="margin-top: 0;">🌐 Explore Global Genex</h3>
                <p style="margin: 10px 0;">While you wait, feel free to learn more about our services and solutions.</p>
                <p><a href="https://global-genex.com">Visit Our Website</a> | <a href="https://global-genex.com/about">About Us</a> | <a href="https://global-genex.com/business">Our Services</a></p>
            </div>

            <p style="color: #64748b; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                <strong>Need immediate assistance?</strong> You can reach us directly at <a href="mailto:info@global-genex.com" style="color: #0891b2;">info@global-genex.com</a> or call our support line during business hours.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Global Genex</strong><br>
            Innovative Solutions for Global Business<br>
            <a href="https://global-genex.com">www.global-genex.com</a></p>
            <p style="font-size: 12px; margin-top: 15px; opacity: 0.8;">
                This is an automated confirmation email. Please do not reply to this address.<br>
                For support, contact us at info@global-genex.com
            </p>
        </div>
    </div>
</body>
</html>`;

  const textTemplate = `
Thank You for Contacting Global Genex!

Hi ${data.name},

Your ${data.inquiryType} inquiry has been successfully received and our team will review it carefully.

SUBMISSION SUMMARY:
- Name: ${data.name}
- Email: ${data.email}${data.companyName ? `\n- Company: ${data.companyName}` : ''}
- Inquiry Type: ${data.inquiryType}
- Submitted: ${new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}

WHAT HAPPENS NEXT:
✓ Immediate: Your inquiry is logged in our system
✓ Within 4 hours: Initial acknowledgment from our team  
✓ Within 24-48 hours: Detailed response with next steps
✓ Follow-up: Scheduled call or meeting if needed

EXPLORE GLOBAL GENEX:
While you wait, learn more about our services:
- Website: https://global-genex.com
- About Us: https://global-genex.com/about  
- Our Services: https://global-genex.com/business

Need immediate assistance? Contact us directly:
📧 Email: info@global-genex.com
🌐 Website: www.global-genex.com

---
Global Genex
Innovative Solutions for Global Business

This is an automated confirmation email. Please do not reply to this address.
For support, contact us at info@global-genex.com
`.trim();

  const emailPayload = {
    from: 'Global Genex Support <noreply@mail.global-genex.com>',
    to: [data.email],
    subject: 'Thank you for contacting Global Genex | Inquiry Received',
    html: htmlTemplate,
    text: textTemplate,
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
    console.log('Confirmation email sent successfully:', result.id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown confirmation email error' };
  }
}

/** Send via Resend */
async function sendEmail(data: ContactFormData, env: Env): Promise<{ success: boolean; error?: string }> {
  const recipientEmail = env.RECIPIENT_EMAIL || 'info@global-genex.com';

  const emailPayload = {
    from: 'Contact Form <noreply@mail.global-genex.com>',
    to: [recipientEmail],
    subject: `New ${data.inquiryType} from ${data.name}${data.companyName ? ` (${data.companyName})` : ''}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:15px 0;">
        <h3 style="color:#1e3a5f;margin-top:0;">Contact Information</h3>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.companyName ? `<p><strong>Company:</strong> ${escapeHtml(data.companyName)}</p>` : ''}
        ${data.phoneNumber ? `<p><strong>Phone:</strong> ${escapeHtml(data.phoneNumber)}</p>` : ''}
        <p><strong>Inquiry Type:</strong> <span style="color:#0891b2;font-weight:600;">${escapeHtml(data.inquiryType)}</span></p>
      </div>
      
      <h3 style="color:#1e3a5f;">Message</h3>
      <div style="background:#f5f5f5;padding:15px;border-left:4px solid #0891b2;margin:10px 0;border-radius:4px;">
        ${escapeHtml(data.message).replace(/\n/g, '<br>')}
      </div>
      
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
      <p style="color:#64748b;font-size:14px;">
        <strong>Privacy Consent:</strong> ✅ Confirmed<br>
        <strong>Submitted at:</strong> ${new Date().toISOString()}
      </p>
    `,
    text: `
New Contact Form Submission

CONTACT INFORMATION:
Name: ${data.name}
Email: ${data.email}
${data.companyName ? `Company: ${data.companyName}\n` : ''}${data.phoneNumber ? `Phone: ${data.phoneNumber}\n` : ''}Inquiry Type: ${data.inquiryType}

MESSAGE:
${data.message}

Privacy Consent: Confirmed
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
    : ['https://global-genex.com', 'https://www.global-genex.com'];
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
      companyName: v.companyName ? (v.companyName as string).trim() : '',
      phoneNumber: v.phoneNumber ? (v.phoneNumber as string).trim() : '',
      inquiryType: (v.inquiryType as string),
      message: (v.message as string).trim(),
      privacyConsent: (v.privacyConsent as boolean),
      honeypot: (v.honeypot as string) || '',
      timestamp: (v.timestamp as number) || Date.now(),
    };

    // Send internal notification email
    const emailResult = await sendEmail(contactData, env);
    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to send message. Please try again later.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Send confirmation email to user (failure doesn't affect user response)
    const confirmationResult = await sendConfirmationEmail(contactData, env);
    if (!confirmationResult.success) {
      console.error('Confirmation email failed:', confirmationResult.error);
      // Log the failure but don't affect the user response since the main email succeeded
    } else {
      console.log('Both internal and confirmation emails sent successfully');
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
