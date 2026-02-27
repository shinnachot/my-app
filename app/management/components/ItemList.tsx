'use client'

import { useManagement } from '@/context/managementContext'

export function ItemList() {
    const { state, dispatch } = useManagement()
    return (
        <ul className="space-y-2">
            {state.items.map((item) => (
                <li
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded border ${state.selectedId === item.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                >
                    <button
                        type="button"
                        className="cursor-pointer flex-1 text-left bg-transparent border-none"
                        onClick={() =>
                            dispatch({
                                type: 'VIEW',
                                payload: state.selectedId === item.id ? null : item.id,
                            })
                        }
                    >
                        {item.name}
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'REMOVE', payload: item.id })}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    )
}
