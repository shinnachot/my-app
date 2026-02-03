'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
    const { data: session, status } = useSession();

    return (
        <header className="bg-white p-4 text-black border-b">
            <nav>
                <ul className="flex gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/task">Task</Link>
                        </li>
                        <li>
                            <Link href="/product">Product</Link>
                        </li>
                    </div>
                    <div className="flex gap-4 items-center">
                        {status === 'loading' ? (
                            <li>กำลังโหลด...</li>
                        ) : session ? (
                            <>
                                <li className="text-sm">
                                    สวัสดี, {session.user?.name}
                                </li>
                                <li>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link
                                    href="/signin"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Sign In
                                </Link>
                            </li>
                        )}
                    </div>
                </ul>
            </nav>
        </header>
    );
}