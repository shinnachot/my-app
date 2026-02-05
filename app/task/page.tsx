'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '../lib/apiClient';

interface Task {
    id: string;
    title?: string;
    description?: string;
    [key: string]: unknown;
}

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
}

export default function TaskPage(): React.ReactNode {
    const { data: session, status } = useSession();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            if (status === 'loading') return; // รอให้ session โหลดเสร็จก่อน

            if (!session?.user) {
                setError('กรุณาเข้าสู่ระบบก่อน');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // apiClient จะดึง token จาก session และจัดการ refresh อัตโนมัติเมื่อเจอ 401
                const { data } = await apiClient.get<Task[]>('/tasks');
                setTasks(Array.isArray(data) ? data : []);
            } catch (err: unknown) {
                setError(getErrorMessage(err));
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
                <h1 className="text-2xl font-bold mb-4">Task</h1>
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Task</h1>
                <p className="text-red-500">กรุณาเข้าสู่ระบบก่อน</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Task</h1>

            {loading && <p>กำลังโหลดข้อมูล...</p>}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div>
                    {tasks.length === 0 ? (
                        <p>ไม่มีข้อมูล tasks</p>
                    ) : (
                        <ul className="space-y-2">
                            {tasks.map((task) => (
                                <li key={task.id} className="border p-4 rounded">
                                    <h3 className="font-semibold">{task.title || `Task ${task.id}`}</h3>
                                    {task.description && (
                                        <p className="text-gray-600">{task.description}</p>
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