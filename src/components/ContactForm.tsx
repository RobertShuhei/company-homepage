'use client'

import { useState, FormEvent } from 'react'

// サーバーからのレスポンスの型を定義
interface FormResponse {
  success: boolean
  error?: string // エラーメッセージはオプション
}

interface FormData {
  name: string
  email: string
  message: string
  honeypot: string
  timestamp: number
}

interface FormState {
  isSubmitting: boolean
  isSubmitted: boolean
  error: string | null
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
    timestamp: Date.now()
  })

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  })

  // API endpoint - replace with your deployed worker URL
  const API_ENDPOINT = process.env.NODE_ENV === 'production' 
    ? 'https://company-contact-api.your-username.workers.dev'
    : 'https://company-contact-api-dev.your-username.workers.dev'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required'
    if (formData.name.trim().length < 2) return 'Name must be at least 2 characters'
    if (formData.name.trim().length > 100) return 'Name must be less than 100 characters'
    
    if (!formData.email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address'
    
    if (!formData.message.trim()) return 'Message is required'
    if (formData.message.trim().length < 10) return 'Message must be at least 10 characters'
    if (formData.message.trim().length > 2000) return 'Message must be less than 2000 characters'
    
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Reset previous states
    setFormState(prev => ({ ...prev, error: null }))
    
    // Client-side validation
    const validationError = validateForm()
    if (validationError) {
      setFormState(prev => ({ ...prev, error: validationError }))
      return
    }
    
    setFormState(prev => ({ ...prev, isSubmitting: true }))
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          honeypot: formData.honeypot, // Should be empty for legitimate users
          timestamp: formData.timestamp
        })
      })

      // サーバーからのレスポンスを FormResponse 型にキャスト（型アサーション）
      const result = await response.json() as FormResponse

      if (response.ok && result.success) {
        setFormState({
          isSubmitting: false,
          isSubmitted: true,
          error: null
        })
        
        // Reset form data
        setFormData({
          name: '',
          email: '',
          message: '',
          honeypot: '',
          timestamp: Date.now()
        })
      } else {
        // result.error が存在しない場合に備えてフォールバック
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      })
    }
  }

  if (formState.isSubmitted) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            className="w-8 h-8 text-green-600"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-navy mb-4">
          Message Sent Successfully!
        </h3>
        
        <p className="text-gray mb-6">
          Thank you for reaching out. We have received your message and will respond within 24 hours.
        </p>
        
        <button
          onClick={() => setFormState(prev => ({ ...prev, isSubmitted: false }))}
          className="text-teal hover:text-teal/80 font-semibold"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formState.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-red-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{formState.error}</p>
            </div>
          </div>
        </div>
      )}

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
        />
      </div>

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
        />
        <div className="mt-1 text-sm text-gray-500 text-right">
          {formData.message.length}/2000 characters
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
          disabled={formState.isSubmitting}
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
        <p>
          We respect your privacy. Your information will not be shared with third parties.
        </p>
        <p className="mt-1">
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="text-teal hover:text-teal/80">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </form>
  )
}