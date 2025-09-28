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
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={translate('passwordPlaceholder')}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
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
