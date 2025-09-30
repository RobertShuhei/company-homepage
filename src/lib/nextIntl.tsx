'use client'

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'

type Messages = Record<string, unknown>

interface IntlContextValue {
  locale?: string
  messages: Messages
}

const IntlContext = createContext<IntlContextValue | null>(null)

export interface NextIntlClientProviderProps {
  children: ReactNode
  locale?: string
  messages?: Messages
}

export function NextIntlClientProvider({
  children,
  locale,
  messages = {},
}: NextIntlClientProviderProps) {
  const value = useMemo<IntlContextValue>(
    () => ({
      locale,
      messages,
    }),
    [locale, messages]
  )

  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>
}

type TranslationValues = Record<string, string | number>

const resolvePath = (messages: Messages, path: string): unknown => {
  const segments = path.split('.')
  let current: unknown = messages

  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[segment]
    } else {
      return undefined
    }
  }

  return current
}

const formatMessage = (template: string, values?: TranslationValues) => {
  if (!values) {
    return template
  }

  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (values[key] === undefined || values[key] === null) {
      return match
    }
    return String(values[key])
  })
}

export function useTranslations(namespace?: string) {
  const context = useContext(IntlContext)

  if (!context) {
    throw new Error('useTranslations must be used within a NextIntlClientProvider')
  }

  const { messages } = context

  return useCallback(
    (key: string, values?: TranslationValues) => {
      const path = namespace ? `${namespace}.${key}` : key
      const resolved = resolvePath(messages, path)

      if (typeof resolved === 'string') {
        return formatMessage(resolved, values)
      }

      return path
    },
    [messages, namespace]
  )
}

export function useIntlMessages(): Messages {
  const context = useContext(IntlContext)

  if (!context) {
    throw new Error('useIntlMessages must be used within a NextIntlClientProvider')
  }

  return context.messages
}

export function useLocale(): string | undefined {
  const context = useContext(IntlContext)

  if (!context) {
    throw new Error('useLocale must be used within a NextIntlClientProvider')
  }

  return context.locale
}
