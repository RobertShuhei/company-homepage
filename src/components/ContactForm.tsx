'use client';

import { useState, FormEvent } from 'react';

interface FormResponse {
  success: boolean;
  error?: string;
}

interface FormData {
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

interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    companyName: '',
    phoneNumber: '',
    inquiryType: '',
    message: '',
    privacyConsent: false,
    honeypot: '',
    timestamp: Date.now(),
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  // Production API endpoint
  const API_ENDPOINT =
    process.env.NODE_ENV === 'production'
      ? 'https://company-contact-api-production.global-genex.workers.dev'
      : 'http://localhost:8787';


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (formData.name.trim().length < 2) return 'Name must be at least 2 characters';
    if (formData.name.trim().length > 100) return 'Name must be less than 100 characters';

    if (!formData.email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';

    // Optional company name validation
    if (formData.companyName.trim() && formData.companyName.trim().length > 100) {
      return 'Company name must be less than 100 characters';
    }

    // Optional phone number validation
    if (formData.phoneNumber.trim()) {
      const phoneRegex = /^[\+]?[\d]{8,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }

    if (!formData.inquiryType) return 'Please select an inquiry type';

    if (!formData.message.trim()) return 'Message is required';
    if (formData.message.trim().length < 10) return 'Message must be at least 10 characters';
    if (formData.message.trim().length > 2000) return 'Message must be less than 2000 characters';

    if (!formData.privacyConsent) return 'You must agree to our Privacy Policy to proceed';

    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setFormState(prev => ({ ...prev, error: null }));

    const validationError = validateForm();
    if (validationError) {
      setFormState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    // 送信直前に最新 timestamp を設定（最小修正）
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      companyName: formData.companyName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      inquiryType: formData.inquiryType,
      message: formData.message.trim(),
      privacyConsent: formData.privacyConsent,
      honeypot: formData.honeypot,
      timestamp: Date.now(),
    };

    // タイムアウト（任意だがUX向上・10秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let result: FormResponse | null = null;
      try {
        result = await response.json();
      } catch {
        // JSON でなければ null のまま
      }

      if (response.ok && result?.success) {
        setFormState({ isSubmitting: false, isSubmitted: true, error: null });
        setFormData({ 
          name: '', 
          email: '', 
          companyName: '',
          phoneNumber: '',
          inquiryType: '',
          message: '', 
          privacyConsent: false,
          honeypot: '', 
          timestamp: Date.now() 
        });
      } else {
        throw new Error(result?.error || `Failed to send message (${response.status})`);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Form submission error:', error);
      
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error instanceof Error) {
        // Check if it's the timing protection error and provide Japanese message
        if (error.message.includes('Submission too fast')) {
          errorMessage = '送信に失敗しました。もう一度お試しください。';
        } else {
          errorMessage = error.message;
        }
      }
      
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: errorMessage,
      });
    }
  };

  if (formState.isSubmitted) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-2xl font-bold text-navy mb-4">Message Sent Successfully!</h3>

        <p className="text-gray mb-6">
          Thank you for reaching out. We have received your message and will respond within 24 hours.
        </p>

        <button
          onClick={() => {
            setFormState(prev => ({ ...prev, isSubmitted: false }));
          }}
          className="text-teal hover:text-teal/80 font-semibold"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formState.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{formState.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Two-column layout for name/company and email/phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={formState.isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your full name"
            maxLength={100}
            aria-describedby="name-help"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-semibold text-navy mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            disabled={formState.isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your company name (optional)"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={formState.isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your email address"
            maxLength={254}
            aria-describedby="email-help"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-semibold text-navy mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={formState.isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your phone number (optional)"
            maxLength={20}
          />
        </div>
      </div>

      {/* Full-width inquiry type field */}
      <div>
        <label htmlFor="inquiryType" className="block text-sm font-semibold text-navy mb-2">
          Inquiry Type *
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleInputChange}
          required
          disabled={formState.isSubmitting}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
          aria-describedby="inquiry-help"
        >
          <option value="">Please select an inquiry type</option>
          <option value="Service Inquiry">Service Inquiry</option>
          <option value="Hiring">Hiring</option>
          <option value="Partnership">Partnership</option>
          <option value="General Support">General Support</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Full-width message field */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          disabled={formState.isSubmitting}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-teal transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
          placeholder="Tell us about your project or how we can help you..."
          maxLength={2000}
          aria-describedby="message-help"
        />
        <div className="mt-1 text-sm text-gray-500 text-right">
          {formData.message.length}/2000 characters
        </div>
      </div>

      {/* Privacy Policy consent checkbox */}
      <div>
        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacyConsent"
            name="privacyConsent"
            checked={formData.privacyConsent}
            onChange={handleInputChange}
            required
            disabled={formState.isSubmitting}
            className="mt-1 h-4 w-4 text-teal focus:ring-teal border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
            aria-describedby="privacy-help"
          />
          <label htmlFor="privacyConsent" className="ml-3 text-sm text-navy">
            I agree to the{' '}
            <a 
              href="/privacy" 
              className="text-teal hover:text-teal/80 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            {' '}and consent to the processing of my personal data. *
          </label>
        </div>
      </div>

      {/* Honeypot field - hidden from users but visible to bots */}
      <div className="hidden">
        <label htmlFor="honeypot">Leave this field empty</label>
        <input
          type="text"
          id="honeypot"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleInputChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={formState.isSubmitting || !formData.privacyConsent || !formData.inquiryType}
          className="w-full bg-teal text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
        >
          {formState.isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending Message...
            </div>
          ) : (
            'Send Message'
          )}
        </button>
      </div>

      <div className="text-sm text-gray-500 text-center">
        <p>We respect your privacy. Your information will not be shared with third parties.</p>
      </div>
    </form>
  );
}
