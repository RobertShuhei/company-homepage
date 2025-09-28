'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  locale: string
}

export default function LogoutButton({ locale }: LogoutButtonProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = useCallback(async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' })

      if (!response.ok) {
        const data = await response.json().catch(() => null) as { error?: string } | null
        throw new Error(data?.error || 'Failed to log out')
      }

      router.replace(`/${locale}/admin/login`)
      router.refresh()
    } catch (err) {
      console.error('Admin logout failed:', err)
      setError('ログアウト処理でエラーが発生しました。もう一度お試しください。')
      setIsSubmitting(false)
    }
  }, [isSubmitting, locale, router])

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'ログアウト中…' : 'ログアウト'}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
