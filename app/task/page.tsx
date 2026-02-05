'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useGetTasksQuery } from '../lib/api';

interface Task {
    id: string;
    title?: string;
    description?: string;
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

export default function TaskPage(): React.ReactNode {
    const { data: session, status } = useSession();
    // Skip query if session is loading or user is not authenticated
    const { data: tasks = [], isLoading: loading, error } = useGetTasksQuery(undefined, {
        skip: status === 'loading' || !session?.user,
    });

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
                    {getErrorMessage(error)}
                </div>
            )}

            {!loading && !error && (
                <div>
                    {tasks.length === 0 ? (
                        <p>ไม่มีข้อมูล tasks</p>
                    ) : (
                        <ul className="space-y-2">
                            {tasks.map((task) => {
                                const taskId = typeof task.id === 'string' ? task.id : String(task.id ?? '')
                                const taskTitle = typeof task.title === 'string' ? task.title : `Task ${taskId}`
                                const taskDescription = typeof task.description === 'string' ? task.description : null
                                return (
                                    <li key={taskId} className="border p-4 rounded">
                                        <h3 className="font-semibold">{taskTitle}</h3>
                                        {taskDescription !== null && (
                                            <p className="text-gray-600">{taskDescription}</p>
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