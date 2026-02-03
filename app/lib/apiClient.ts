'use client'

import { getSession } from 'next-auth/react'
import {
    refreshAccessToken,
    updateSessionWithNewToken,
    isUnauthorizedResponse
} from './tokenManager'

export interface ApiClientOptions extends RequestInit {
    skipAuth?: boolean // ถ้า true จะไม่ใส่ Authorization header
    accessToken?: string // ถ้ามี token ให้ใช้ token นี้แทนการดึงจาก session
    refreshToken?: string // ถ้ามี refreshToken ให้ใช้ตัวนี้แทนการดึงจาก session
}

// เก็บ token ที่ refresh แล้วเพื่อใช้ใน request ถัดไป
let cachedTokens: { accessToken: string; refreshToken: string } | null = null

/**
 * API Client wrapper ที่จัดการ token refresh อัตโนมัติ
 * เมื่อ token หมดอายุ (401) จะ refresh token อัตโนมัติและ retry request
 */
export async function apiClient(url: string, options: ApiClientOptions = {}): Promise<Response> {
    const {
        skipAuth = false,
        accessToken: providedToken,
        refreshToken: providedRefreshToken,
        ...fetchOptions
    } = options

    // ถ้า skipAuth ให้เรียก API โดยตรง
    if (skipAuth) {
        return fetch(url, fetchOptions)
    }

    // ดึง session เพื่อเอา token (ถ้ายังไม่มี providedToken)
    let accessToken = providedToken || cachedTokens?.accessToken
    let refreshToken = providedRefreshToken || cachedTokens?.refreshToken

    // ถ้ายังไม่มี token และไม่ได้ skipAuth ให้ดึงจาก session
    if (!skipAuth && (!accessToken || !refreshToken)) {
        const session = await getSession()
        if (session?.user) {
            accessToken =
                providedToken || (session.user as any)?.accessToken || cachedTokens?.accessToken
            refreshToken =
                providedRefreshToken ||
                (session.user as any)?.refreshToken ||
                cachedTokens?.refreshToken
        }
    }

    // ถ้าไม่ได้ skipAuth แต่ไม่มี token ให้ throw error
    if (!skipAuth && !accessToken) {
        throw new Error('ไม่พบ accessToken ใน session กรุณาเข้าสู่ระบบก่อน')
    }

    // สร้าง headers
    const headers = new Headers(fetchOptions.headers)

    // ถ้ามี token ให้ใส่ Authorization header
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
    }

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }

    // เรียก API ครั้งแรก
    let response = await fetch(url, {
        ...fetchOptions,
        headers
    })

    // ถ้าได้ 401 และมี refreshToken ให้ refresh token (เฉพาะเมื่อไม่ได้ skipAuth)
    if (!skipAuth && isUnauthorizedResponse(response) && refreshToken && accessToken) {
        try {
            // Refresh token
            const newTokens = await refreshAccessToken(refreshToken)
            console.log('newTokens', newTokens)

            // เก็บ token ใหม่ไว้ใน cache
            cachedTokens = {
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken || refreshToken
            }

            // อัปเดต session (สำหรับการใช้งานในอนาคต)
            await updateSessionWithNewToken(
                newTokens.accessToken,
                newTokens.refreshToken || refreshToken
            )

            // Retry request ด้วย token ใหม่
            headers.set('Authorization', `Bearer ${newTokens.accessToken}`)
            response = await fetch(url, {
                ...fetchOptions,
                headers
            })

            // ถ้ายังได้ 401 หลังจาก refresh แสดงว่า refreshToken หมดอายุแล้ว
            if (isUnauthorizedResponse(response)) {
                cachedTokens = null // Clear cache
                throw new Error('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่')
            }
        } catch (error: any) {
            cachedTokens = null // Clear cache on error
            // ถ้า refresh token ล้มเหลว ให้ throw error
            throw new Error(error.message || 'ไม่สามารถ refresh token ได้')
        }
    }

    return response
}

/**
 * Clear cached tokens (ใช้เมื่อ logout หรือ session หมดอายุ)
 */
export function clearCachedTokens(): void {
    cachedTokens = null
}

/**
 * Helper function สำหรับ GET request
 */
export async function apiGet(url: string, options: ApiClientOptions = {}): Promise<Response> {
    return apiClient(url, {
        ...options,
        method: 'GET'
    })
}

/**
 * Helper function สำหรับ POST request
 */
export async function apiPost(
    url: string,
    body?: any,
    options: ApiClientOptions = {}
): Promise<Response> {
    return apiClient(url, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined
    })
}

/**
 * Helper function สำหรับ PUT request
 */
export async function apiPut(
    url: string,
    body?: any,
    options: ApiClientOptions = {}
): Promise<Response> {
    return apiClient(url, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined
    })
}

/**
 * Helper function สำหรับ DELETE request
 */
export async function apiDelete(url: string, options: ApiClientOptions = {}): Promise<Response> {
    return apiClient(url, {
        ...options,
        method: 'DELETE'
    })
}
