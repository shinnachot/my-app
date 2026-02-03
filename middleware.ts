import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        // ถ้ามี token อยู่แล้ว ให้ผ่านไปได้
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // ตรวจสอบว่ามี token หรือไม่
                // ถ้าไม่มี token จะ return false และ redirect ไปที่ signin page
                return !!token
            }
        },
        pages: {
            signIn: '/signin' // กำหนดหน้า signin
        }
    }
)

// กำหนด path ที่ต้องการป้องกัน
export const config = {
    matcher: ['/task/:path*'] // ป้องกันทุก path ที่เริ่มด้วย /task
}
