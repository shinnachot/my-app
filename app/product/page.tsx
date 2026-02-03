'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiGet } from '../lib/apiClient';

interface Product {
    id: string;
    name?: string;
    price?: number;
    [key: string]: any;
}

export default function ProductPage(): React.ReactNode {
    const { data: session, status } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            if (status === 'loading') return; // รอให้ session โหลดเสร็จก่อน

            setLoading(true);
            setError(null);

            try {
                // API นี้ไม่ต้องการ accessToken
                const response = await apiGet(process.env.NEXT_PUBLIC_APP_ENDPOINT + '/product', {
                    skipAuth: true
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
                console.error('Error fetching tasks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [session, status]);

    if (status === 'loading') {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Product</h1>
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Product</h1>

            {loading && <p>กำลังโหลดข้อมูล...</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div>
                    {products.length === 0 ? (
                        <p>ไม่มีข้อมูล products</p>
                    ) : (
                        <ul className="space-y-2">
                            {products.map((product) => (
                                <li key={product.id} className="border p-4 rounded">
                                    <h3 className="font-semibold">{product.name || `product ${product.id}`}</h3>
                                    {product.price && (
                                        <p className="text-gray-600">{product.price}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}