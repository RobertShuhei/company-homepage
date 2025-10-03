'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Translations } from '@/lib/i18n'

type AdminLoginMessages = Translations['admin']['login']

interface LoginFormProps {
  redirectTo: string
  messages?: AdminLoginMessages
}

const FALLBACK_MESSAGES: AdminLoginMessages = {
  title: 'Admin Login',
  description: 'Only authenticated administrators can access the dashboard.',
  passwordLabel: 'Administrator Password',
  passwordPlaceholder: 'Enter password',
  button: 'Log In',
  loading: 'Authenticating…',
  footerNote: 'Contact your administrator if you have questions about your login credentials.',
  errors: {
    generic: 'Authentication failed. Please try again.',
    network: 'Failed to communicate with the server. Please try again later.',
    missingPassword: 'Please enter the administrator password.',
    invalidPassword: 'Administrator authentication failed.',
    server: 'An error occurred while processing authentication.',
  }
}

function getMessage(messages: AdminLoginMessages | undefined, path: string): string {
  const keys = path.split('.')
  let current: unknown = messages

  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return getFallback(path)
    }
  }

  return typeof current === 'string' ? current : getFallback(path)
}

function getFallback(path: string): string {
  const keys = path.split('.')
  let current: unknown = FALLBACK_MESSAGES

  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }

  return typeof current === 'string' ? current : path
}

export default function LoginForm({ redirectTo, messages }: LoginFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const translate = useCallback(
    (path: string) => getMessage(messages, path),
    [messages]
  )

  const resolveErrorMessage = useCallback(
    (code?: string, fallback?: string) => {
      if (!code) {
        return fallback ?? translate('errors.generic')
      }

      const message = translate(`errors.${code}`)
      if (message === `errors.${code}`) {
        return fallback ?? translate('errors.generic')
      }

      return message
    },
    [translate]
  )

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, redirectTo }),
      })

      const data = await response.json() as { success?: boolean; error?: string; errorCode?: string; redirectTo?: string }

      if (!response.ok || !data.success) {
        setError(resolveErrorMessage(data.errorCode, data.error ?? undefined))
        setIsSubmitting(false)
        return
      }

      router.push(data.redirectTo || redirectTo)
      router.refresh()
    } catch (err) {
      console.error('Admin login failed:', err)
      setError(translate('errors.network'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            {translate('title')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {translate('description')}
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 shadow-md rounded-lg border" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {translate('passwordLabel')}
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                placeholder={translate('passwordPlaceholder')}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? translate('loading') : translate('button')}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          {translate('footerNote')}
        </p>
      </div>
    </div>
  )
}
