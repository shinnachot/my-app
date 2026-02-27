'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <button className="w-24 h-9">Theme</button>;
    }

    return (
        <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            Toggle theme (current: {resolvedTheme})
        </button>
    );
}

export default function Header() {
    const { data: session, status } = useSession();

    const authContent = (() => {
        if (status === "loading") {
            return <li>กำลังโหลด...</li>;
        }

        if (session) {
            return (
                <>
                    <li className="text-sm">สวัสดี, {session.user?.name}</li>
                    <li>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Sign Out
                        </button>
                    </li>
                </>
            );
        }

        return (
            <li>
                <Link
                    href="/signin"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Sign In
                </Link>
            </li>
        );
    })();

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
                        <li>
                            <Link href="/zustand">Zustand</Link>
                        </li>
                        <li>
                            <Link href="/management">Management</Link>
                        </li>
                        <li>
                            <Link href="/temperature">Temperature (Redux)</Link>
                        </li>
                        <li>
                            <Link href="/food">Food Reducer</Link>
                        </li>
                    </div>
                    <div className="flex gap-4 items-center">
                        <ThemeToggle />
                        {authContent}
                    </div>
                </ul>
            </nav>
        </header>
    );
}