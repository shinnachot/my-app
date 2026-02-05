import { getSession } from 'next-auth/react'

export type AuthTokens = {
    accessToken?: string
}

/**
 * In-memory access token cache.
 *
 * Production note:
 * - Do NOT store refresh tokens in browser storage (sessionStorage/localStorage).
 * - Refresh should happen server-side (e.g., NextAuth jwt callback) using HttpOnly cookies.
 */
let memoryTokens: AuthTokens = {}

export function setTokens(tokens: AuthTokens) {
    memoryTokens = { ...memoryTokens, ...tokens }
}

export function clearTokens() {
    memoryTokens = {}
}

export async function getAccessToken(): Promise<string | undefined> {
    if (memoryTokens.accessToken) return memoryTokens.accessToken
    const session = await getSession()
    const accessToken = session?.user?.accessToken
    if (accessToken) {
        memoryTokens = { ...memoryTokens, accessToken }
    }
    return accessToken
}
