import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('กรุณากรอก username และ password');
                }

                try {
                    const response = await fetch('http://localhost:3001/auth/signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });

                    if (!response.ok) {
                        const error = await response.json().catch(() => ({}));
                        throw new Error(error.message || 'การเข้าสู่ระบบล้มเหลว');
                    }

                    const data = await response.json();

                    if (data.accessToken && data.refreshToken) {
                        return {
                            id: credentials.username,
                            name: credentials.username,
                            accessToken: data.accessToken,
                            refreshToken: data.refreshToken,
                        };
                    }

                    throw new Error('ไม่พบ token จาก server');
                } catch (error: any) {
                    throw new Error(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.refreshToken = (user as any).refreshToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).accessToken = token.accessToken;
                (session.user as any).refreshToken = token.refreshToken;
            }
            return session;
        },
    },
    pages: {
        signIn: '/signin',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
