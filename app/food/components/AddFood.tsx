import { Dispatch, useState } from 'react'
import type { FoodAction } from '@/hooks/useFoodReducer'

export function AddFood({ foodDispatch }: Readonly<{ foodDispatch: Dispatch<FoodAction> }>) {
    const [food, setFood] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (food.trim()) {
            foodDispatch({ type: 'ADD_FOOD', payload: food })
            setFood('')
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input type="text" placeholder="Food name" value={food} onChange={(e) => setFood(e.target.value)} />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add Food</button>
        </form>
    )
}