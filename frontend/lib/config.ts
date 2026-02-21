const rawBaseUrl = process.env.NEXT_PUBLIC_API?.trim()

// Prefer same-origin proxy to avoid CORS/mixed-content issues in browser.
export const API_BASE_URL = rawBaseUrl && rawBaseUrl.length > 0 ? rawBaseUrl : "/api"
