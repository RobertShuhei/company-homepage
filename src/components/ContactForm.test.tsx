import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ContactForm from './ContactForm'

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/ja'),
}))

// Mock the translation hook
vi.mock('@/lib/hooks/useTranslations', () => ({
  useTranslations: vi.fn(() => ({
    t: {
      contact: {
        form: {
          fields: {
            name: { label: 'お名前 *', placeholder: 'お名前をご入力ください' },
            email: { label: 'メールアドレス *', placeholder: 'メールアドレスをご入力ください' },
            message: { label: 'メッセージ *', placeholder: 'プロジェクトの詳細やご質問をご記入ください…', characterCount: '文字' },
            companyName: { label: '会社名', placeholder: '会社名をご入力ください（任意）' },
            phoneNumber: { label: '電話番号', placeholder: '電話番号をご入力ください（任意）' },
            inquiryType: { label: 'お問い合わせ種別 *', placeholder: 'お問い合わせ種別を選択してください' },
            privacyConsent: { label: '当社の', privacyPolicy: 'プライバシーポリシー', consentText: 'に同意し、個人情報の取り扱いに同意します。*' }
          },
          states: { submit: '送信する' },
          privacy: { message: '当社はお客様のプライバシーを尊重します。情報が第三者と共有されることはありません。' }
        }
      }
    }, // Mock client translations
    isLoading: false, // Not loading
  })),
  getNestedTranslation: vi.fn((_translations, path, fallback) => {
    // Return Japanese translations for the specific paths we're testing
    const translationMap: Record<string, string> = {
      'contact.form.fields.name.label': 'お名前 *',
      'contact.form.fields.name.placeholder': 'お名前をご入力ください',
      'contact.form.fields.email.label': 'メールアドレス *',
      'contact.form.fields.email.placeholder': 'メールアドレスをご入力ください',
      'contact.form.fields.message.label': 'メッセージ *',
      'contact.form.fields.message.placeholder': 'プロジェクトの詳細やご質問をご記入ください…',
      'contact.form.states.submit': '送信する',
      'contact.form.fields.companyName.label': '会社名',
      'contact.form.fields.companyName.placeholder': '会社名をご入力ください（任意）',
      'contact.form.fields.phoneNumber.label': '電話番号',
      'contact.form.fields.phoneNumber.placeholder': '電話番号をご入力ください（任意）',
      'contact.form.fields.inquiryType.label': 'お問い合わせ種別 *',
      'contact.form.fields.inquiryType.placeholder': 'お問い合わせ種別を選択してください',
      'contact.form.fields.privacyConsent.label': '当社の',
      'contact.form.fields.privacyConsent.privacyPolicy': 'プライバシーポリシー',
      'contact.form.fields.privacyConsent.consentText': 'に同意し、個人情報の取り扱いに同意します。*',
      'contact.form.fields.message.characterCount': '文字',
      'contact.form.privacy.message': '当社はお客様のプライバシーを尊重します。情報が第三者と共有されることはありません。'
    }

    return translationMap[path] || fallback || path
  }),
}))

// Mock the i18n config
vi.mock('../i18n.config', () => ({
  getLocaleFromPathname: vi.fn(() => 'ja'),
  addLocaleToPathname: vi.fn((path, locale) => `/${locale}${path}`),
}))

describe('ContactForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the name input field with Japanese label "お名前"', () => {
    render(<ContactForm />)

    const nameLabel = screen.getByLabelText(/お名前/)
    expect(nameLabel).toBeInTheDocument()
    expect(nameLabel).toHaveAttribute('type', 'text')
    expect(nameLabel).toHaveAttribute('name', 'name')
    expect(nameLabel).toHaveAttribute('id', 'name')
  })

  it('renders the email input field with Japanese label "メールアドレス"', () => {
    render(<ContactForm />)

    const emailLabel = screen.getByLabelText(/メールアドレス/)
    expect(emailLabel).toBeInTheDocument()
    expect(emailLabel).toHaveAttribute('type', 'email')
    expect(emailLabel).toHaveAttribute('name', 'email')
    expect(emailLabel).toHaveAttribute('id', 'email')
  })

  it('renders the message textarea with Japanese label "メッセージ"', () => {
    render(<ContactForm />)

    const messageLabel = screen.getByLabelText(/メッセージ/)
    expect(messageLabel).toBeInTheDocument()
    expect(messageLabel.tagName.toLowerCase()).toBe('textarea')
    expect(messageLabel).toHaveAttribute('name', 'message')
    expect(messageLabel).toHaveAttribute('id', 'message')
  })

  it('renders the submit button with initial text "送信する"', () => {
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /送信する/ })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })
})