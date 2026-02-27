'use client'

import { useManagement } from '../../../context/managementContext'

export function SelectedView() {
    const { state } = useManagement()
    const selected = state.items.find((i) => i.id === state.selectedId)
    if (!selected) return null
    return (
        <div className="mt-4 p-4 bg-gray-100 rounded">
            <strong>Viewing:</strong> {selected.name} (id: {selected.id})
        </div>
    )
}
