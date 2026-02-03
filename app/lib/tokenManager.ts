'use client';

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
}

/**
 * เรียก refresh token API เพื่อรับ accessToken ใหม่
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_ENDPOINT || 'http://localhost:3001'}/auth/refresh`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken,
                }),
            }
        );

        if (!response.ok) {
            const errorData = (await response.json().catch(() => ({}))) as { message?: string };
            throw new Error(errorData.message || 'การ refresh token ล้มเหลว');
        }

        const data = await response.json();
        
        if (!data.accessToken) {
            throw new Error('ไม่พบ accessToken จาก server');
        }

        return {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken || refreshToken, // ถ้าไม่มี refreshToken ใหม่ให้ใช้ตัวเดิม
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการ refresh token';
        throw new Error(errorMessage);
    }
}

/**
 * อัปเดต session ด้วย token ใหม่
 * เนื่องจาก NextAuth ใช้ JWT strategy, token จะถูกเก็บใน cookie
 * วิธีที่ดีที่สุดคือการอัปเดตผ่าน JWT callback ใน route.ts
 * แต่สำหรับ client-side, เราจะ return token ใหม่และให้ component ใช้ token ใหม่โดยตรง
 * หรือใช้วิธี refresh session
 */
export async function updateSessionWithNewToken(
    accessToken: string,
    refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
    // Return token ใหม่เพื่อให้ component ใช้
    // Session จะถูกอัปเดตอัตโนมัติเมื่อมีการเรียก getSession() ครั้งต่อไป
    // หรือ component สามารถใช้ token ใหม่โดยตรงได้
    return {
        accessToken,
        refreshToken,
    };
}

/**
 * ตรวจสอบว่า response เป็น 401 Unauthorized หรือไม่
 */
export function isUnauthorizedResponse(response: Response): boolean {
    return response.status === 401;
}
