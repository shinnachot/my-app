'use client';

import React from 'react';
import { useGetProductsQuery } from '../lib/api';

interface Product {
    id: string;
    name?: string;
    price?: number;
    [key: string]: unknown;
}

function getErrorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'data' in err) {
        const errorData = (err as { data?: { message?: string } }).data
        if (errorData?.message) return errorData.message
    }
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
}

export default function ProductPage(): React.ReactNode {
    const { data: products = [], isLoading: loading, error } = useGetProductsQuery();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Product</h1>

            {loading && <p>กำลังโหลดข้อมูล...</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {getErrorMessage(error)}
                </div>
            )}

            {!loading && !error && (
                <div>
                    {products.length === 0 ? (
                        <p>ไม่มีข้อมูล products</p>
                    ) : (
                        <ul className="space-y-2">
                            {products.map((product) => {
                                const productId = typeof product.id === 'string' ? product.id : String(product.id ?? '')
                                const productName = typeof product.name === 'string' ? product.name : `product ${productId}`
                                const productPrice = typeof product.price === 'number' ? product.price : null
                                return (
                                    <li key={productId} className="border p-4 rounded">
                                        <h3 className="font-semibold">{productName}</h3>
                                        {productPrice !== null && (
                                            <p className="text-gray-600">{productPrice}</p>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}