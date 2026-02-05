'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SignInFormData {
    username: string;
    password: string;
}

export default function SigninPage(): React.ReactNode {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: SignInFormData) => {
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                username: data.username,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else if (result?.ok) {
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6">
            <h1 className="text-2xl font-bold mb-4">Signin</h1>
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <input
                        type="text"
                        {...register('username', { required: 'กรุณากรอก username' })}
                        placeholder="Username"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username.message as string}</p>
                    )}
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        {...register('password', { required: 'กรุณากรอก password' })}
                        placeholder="Password"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'Signin'}
                </button>
            </form>
        </div>
    );
}