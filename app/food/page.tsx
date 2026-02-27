'use client';

import React from 'react';
import { useFoodReducer } from '@/hooks/useFoodReducer';
import { AddFood } from './components/AddFood';

export default function FoodPage(): React.ReactNode {
    const { state, dispatch } = useFoodReducer()
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Food</h1>
            <AddFood foodDispatch={dispatch} />
            {state.foods.map((food) => (
                <div key={food}>
                    <h1 className="text-2xl font-bold mb-4">{food}</h1>
                </div>
            ))}
        </div>
    );
}