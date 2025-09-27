'use client';

import { useState, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations, getNestedTranslation } from '@/lib/hooks/useTranslations';
import {
  getLocaleFromPathname,
  addLocaleToPathname
} from '../../i18n.config';

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
  const pathname = usePathname();
  const { t: translations, isLoading } = useTranslations();
  
  // Helper function to get translations safely
  const t = (path: string, fallback?: string) => {
    if (!translations) return fallback || path;
    return getNestedTranslation(translations, path, fallback);
  };

  // Get current locale for locale-aware links
  const currentLocale = getLocaleFromPathname(pathname);
  
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
    if (!formData.name.trim()) return t('contact.form.validation.nameRequired');
    if (formData.name.trim().length < 2) return t('contact.form.validation.nameMinLength');
    if (formData.name.trim().length > 60) return t('contact.form.validation.nameMaxLength');

    if (!formData.email.trim()) return t('contact.form.validation.emailRequired');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return t('contact.form.validation.emailInvalid');

    // Optional company name validation
    if (formData.companyName.trim() && formData.companyName.trim().length > 80) {
      return t('contact.form.validation.companyNameMaxLength');
    }

    // Optional phone number validation
    if (formData.phoneNumber.trim()) {
      const phoneRegex = /^[\+]?[\d]{8,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        return t('contact.form.validation.phoneInvalid');
      }
    }

    if (!formData.inquiryType) return t('contact.form.validation.inquiryTypeRequired');

    if (!formData.message.trim()) return t('contact.form.validation.messageRequired');
    if (formData.message.trim().length < 10) return t('contact.form.validation.messageMinLength');
    if (formData.message.trim().length > 2000) return t('contact.form.validation.messageMaxLength');

    if (!formData.privacyConsent) return t('contact.form.validation.privacyConsentRequired');

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

    // ✨ 修正箇所はここです！
    // timestampをpayload作成時に更新することで、サーバー側で'Submission too fast'エラーが発生しなくなります。
    const payload = {
      ...formData,
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
      
      let errorMessage = t('contact.form.error.generic');
      
      if (error instanceof Error) {
        // Check if it's the timing protection error and provide message
        if (error.message.includes('Submission too fast')) {
          errorMessage = t('contact.form.error.tooFast');
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

  // Show loading state while translations are being loaded
  if (isLoading) {
    return (
      <div className="content-spacing flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
      </div>
    );
  }

  if (formState.isSubmitted) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-10 lg:p-12 text-center">
        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-10 h-10 lg:w-12 lg:h-12 text-green-600" aria-label="Success">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-2xl lg:text-3xl font-bold text-navy mb-6">{t('contact.form.success.title')}</h3>

        <p className="text-gray text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
          {t('contact.form.success.message')}
        </p>

        <button
          onClick={() => {
            setFormState(prev => ({ ...prev, isSubmitted: false }));
          }}
          className="text-teal hover:text-teal/80 font-semibold text-lg transition-colors duration-200"
        >
          {t('contact.form.states.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="content-spacing">
      {formState.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Error">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-base lg:text-lg text-red-700 font-medium">{formState.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Two-column layout for name/company and email/phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">
            {t('contact.form.fields.name.label')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={formState.isSubmitting}
            className="form-input"
            placeholder={t('contact.form.fields.name.placeholder')}
            maxLength={60}
            aria-describedby="name-help"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-semibold text-navy mb-2">
            {t('contact.form.fields.companyName.label')}
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            disabled={formState.isSubmitting}
            className="form-input"
            placeholder={t('contact.form.fields.companyName.placeholder')}
            maxLength={80}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
            {t('contact.form.fields.email.label')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={formState.isSubmitting}
            className="form-input"
            placeholder={t('contact.form.fields.email.placeholder')}
            maxLength={254}
            aria-describedby="email-help"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-semibold text-navy mb-2">
            {t('contact.form.fields.phoneNumber.label')}
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={formState.isSubmitting}
            className="form-input"
            placeholder={t('contact.form.fields.phoneNumber.placeholder')}
            maxLength={20}
          />
        </div>
      </div>

      {/* Full-width inquiry type field */}
      <div>
        <label htmlFor="inquiryType" className="block text-sm font-semibold text-navy mb-2">
          {t('contact.form.fields.inquiryType.label')}
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleInputChange}
          required
          disabled={formState.isSubmitting}
          className="form-select"
          aria-describedby="inquiry-help"
        >
          <option value="">{t('contact.form.fields.inquiryType.placeholder')}</option>
          <option value="Service Inquiry">{t('contact.form.fields.inquiryType.options.serviceInquiry')}</option>
          <option value="Hiring">{t('contact.form.fields.inquiryType.options.hiring')}</option>
          <option value="Partnership">{t('contact.form.fields.inquiryType.options.partnership')}</option>
          <option value="General Support">{t('contact.form.fields.inquiryType.options.generalSupport')}</option>
          <option value="Other">{t('contact.form.fields.inquiryType.options.other')}</option>
        </select>
      </div>

      {/* Full-width message field */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2">
          {t('contact.form.fields.message.label')}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          disabled={formState.isSubmitting}
          rows={6}
          className="form-textarea"
          placeholder={t('contact.form.fields.message.placeholder')}
          maxLength={2000}
          aria-describedby="message-help"
        />
        <div className="mt-1 text-sm text-gray-500 text-right">
          {formData.message.length}/2000 {t('contact.form.fields.message.characterCount')}
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
            {t('contact.form.fields.privacyConsent.label')}{' '}
<<<<<<< HEAD
            <a
              href={addLocaleToPathname('/privacy', currentLocale)}
=======
            <a 
              href={addLocaleToPathname('/privacy', currentLocale)} 
>>>>>>> 3ece5cf0d13f509e5ff38ea068119ea095de1ca6
              className="text-teal hover:text-teal/80 underline"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t('contact.form.fields.privacyConsent.privacyPolicy')} (opens in new window)`}
            >
              {t('contact.form.fields.privacyConsent.privacyPolicy')}
            </a>
            {' '}{t('contact.form.fields.privacyConsent.consentText')}
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
          className="w-full btn-primary text-xl lg:text-2xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
        >
          {formState.isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {t('contact.form.states.sending')}
            </div>
          ) : (
            t('contact.form.states.submit')
          )}
        </button>
      </div>

      <div className="text-base lg:text-lg text-gray-500 text-center">
        <p>{t('contact.form.privacy.message')}</p>
      </div>
    </form>
  );
}