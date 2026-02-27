'use client'

import { AddForm } from './components/AddForm'
import { ItemList } from './components/ItemList'
import { SelectedView } from './components/SelectedView'

export default function ManagementPage() {
    return (
        <div className="p-6 max-w-md">
            <h1 className="bg-green-500 dark:bg-blue-500 text-xl font-bold mb-4">useReducer + useContext Sample</h1>
            <AddForm />
            <ItemList />
            <SelectedView />
        </div>
    )
}
