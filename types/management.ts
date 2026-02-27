export type Item = {
    id: string
    name: string
}

export type State = {
    items: Item[]
    selectedId: string | null
}

export type Action =
    | { type: 'ADD'; payload: string }
    | { type: 'REMOVE'; payload: string }
    | { type: 'VIEW'; payload: string | null }
