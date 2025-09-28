export function getApiBaseUrl(): string {
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL
  const inferredBase = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
  const baseUrl = (explicitBase || inferredBase).replace(/\/$/, '')
  return baseUrl
}

export function buildApiUrl(path: string, searchParams?: Record<string, string | number | undefined | null>) {
  const baseUrl = getApiBaseUrl()
  const url = new URL(path, baseUrl)

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}
