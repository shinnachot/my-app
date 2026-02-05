import axios, { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'
import { getAccessToken, setTokens } from './tokenManager'

declare module 'axios' {
    export interface AxiosRequestConfig {
        /**
         * Skip adding Authorization header and skip refresh-on-401 behavior.
         * Useful for public endpoints or auth endpoints.
         */
        skipAuth?: boolean
        /**
         * Internal flag to avoid infinite retry loops.
         */
        _retry?: boolean
    }
}

const baseURL = process.env.NEXT_PUBLIC_APP_ENDPOINT

if (!baseURL) {
    // Keep as runtime error so it's obvious during development.
    console.warn('NEXT_PUBLIC_APP_ENDPOINT is not set; apiClient baseURL will be empty.')
}

// Main API client used across the app
export const apiClient = axios.create({
    baseURL: baseURL || undefined,
    headers: {
        'Content-Type': 'application/json'
    }
})

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    skipAuth?: boolean
    _retry?: boolean
}

apiClient.interceptors.request.use(async (config) => {
    if (config.skipAuth) return config

    const accessToken = await getAccessToken()
    if (!accessToken) return config

    const authValue = `Bearer ${accessToken}`

    if (config.headers instanceof AxiosHeaders) {
        const existing = config.headers.get('Authorization')
        if (!existing) config.headers.set('Authorization', authValue)
        return config
    }

    const headers = (config.headers ?? {}) as Record<string, unknown>
    const existing =
        (headers.Authorization as string | undefined) ??
        (headers.authorization as string | undefined)

    if (!existing) {
        headers.Authorization = authValue
    }

    config.headers = headers as AxiosRequestHeaders
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableRequestConfig
        const status = error.response?.status

        if (!originalRequest || originalRequest.skipAuth) {
            throw error
        }
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            // Trigger NextAuth to run server-side jwt callback (which refreshes tokens)
            const session = await getSession()
            const newAccessToken = session?.user?.accessToken
            if (!newAccessToken) {
                throw error
            }
            setTokens({ accessToken: newAccessToken })
            const authValue = `Bearer ${newAccessToken}`

            if (originalRequest.headers instanceof AxiosHeaders) {
                originalRequest.headers.set('Authorization', authValue)
            } else {
                const headers = (originalRequest.headers ?? {}) as Record<string, unknown>
                headers.Authorization = authValue
                originalRequest.headers = headers as AxiosRequestHeaders
            }

            return apiClient(originalRequest)
        }

        throw error
    }
)
