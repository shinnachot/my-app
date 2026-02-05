export const runtime = 'nodejs'

import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

function decodeJwtExpMs(token: string): number | undefined {
    // Best-effort decode of JWT payload (no signature verification) to read `exp`.
    // This is only used to schedule refresh; the backend still verifies tokens.
    const parts = token.split('.')
    if (parts.length < 2) return undefined
    const payload = parts[1]
    try {
        const base64 = payload
            .replaceAll('-', '+')
            .replaceAll('_', '/')
            .padEnd(Math.ceil(payload.length / 4) * 4, '=')
        const json = Buffer.from(base64, 'base64').toString('utf8')
        const data = JSON.parse(json) as { exp?: number }
        if (typeof data.exp !== 'number') return undefined
        return data.exp * 1000
    } catch {
        return undefined
    }
}

async function refreshWithBackend(
    refreshToken: string
): Promise<{ accessToken: string; refreshToken?: string }> {
    const base = process.env.NEXT_PUBLIC_APP_ENDPOINT
    if (!base) throw new Error('NEXT_PUBLIC_APP_ENDPOINT is not set')
    console.log('call backend')
    const response = await fetch(`${base}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store'
    })

    if (!response.ok) {
        let msg = 'Refresh token failed'
        try {
            const err = (await response.json()) as { message?: string }
            if (err?.message) msg = err.message
        } catch {
            // ignore
        }
        throw new Error(msg)
    }

    const data = (await response.json()) as { accessToken?: string; refreshToken?: string }
    if (!data?.accessToken) throw new Error('Refresh response missing accessToken')
    return { accessToken: data.accessToken, refreshToken: data.refreshToken }
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('กรุณากรอก username และ password')
                }

                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_APP_ENDPOINT}/auth/signin`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                username: credentials.username,
                                password: credentials.password
                            })
                        }
                    )

                    if (!response.ok) {
                        const error = await response.json().catch(() => ({}))
                        throw new Error(error.message || 'การเข้าสู่ระบบล้มเหลว')
                    }

                    const data = await response.json()

                    if (data.accessToken && data.refreshToken) {
                        return {
                            id: credentials.username,
                            name: credentials.username,
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken
                        }
                    }

                    throw new Error('ไม่พบ token จาก server')
                } catch (error: unknown) {
                    throw new Error(
                        error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
                    )
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken
                token.refreshToken = user.refreshToken
                token.accessTokenExpires = user.accessToken
                    ? (decodeJwtExpMs(user.accessToken) ?? Date.now() + 5 * 60 * 1000)
                    : undefined
                token.error = undefined
                return token
            }

            // If we have an expiry time and the access token is still valid, return it.
            if (
                token.accessToken &&
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires - 30_000
            ) {
                return token
            }

            // Access token missing or expired: refresh server-side using refreshToken in JWT cookie (HttpOnly).
            if (!token.refreshToken) {
                token.error = 'MissingRefreshToken'
                return token
            }

            try {
                console.log('[nextauth] refreshing, hasRT=', !!token.refreshToken)
                const refreshed = await refreshWithBackend(token.refreshToken)
                console.log('refreshed', refreshed)
                token.accessToken = refreshed.accessToken
                token.accessTokenExpires =
                    decodeJwtExpMs(refreshed.accessToken) ?? Date.now() + 5 * 60 * 1000
                if (refreshed.refreshToken) {
                    token.refreshToken = refreshed.refreshToken
                }
                token.error = undefined
                return token
            } catch {
                token.error = 'RefreshAccessTokenError'
                return token
            }
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.accessToken = token.accessToken
            }
            session.error = token.error
            return session
        }
    },
    pages: {
        signIn: '/signin'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
