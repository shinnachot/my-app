'use client'

import { useManagement } from '../../../context/managementContext'

export function AddForm() {
    const { dispatch } = useManagement()
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const input = form.elements.namedItem('name') as HTMLInputElement
        const name = input?.value?.trim()
        if (name) {
            dispatch({ type: 'ADD', payload: name })
            input.value = ''
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
                name="name"
                type="text"
                placeholder="Item name"
                className="px-3 py-2 border rounded"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Add
            </button>
        </form>
    )
}
