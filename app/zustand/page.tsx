'use client'

import { useCounterStore } from '@store/useCounterStore';

export default function ZustandPage() {
    const { count, inc, dec } = useCounterStore()

    return (
        <>
            <p>{count}</p>
            <button onClick={inc}>+</button>
            <button onClick={dec}>-</button>
        </>
    )
}