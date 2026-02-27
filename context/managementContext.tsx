'use client'

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
  Dispatch,
} from 'react'
import type { State, Action } from '../types/management'

const initialState: State = {
  items: [],
  selectedId: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: crypto.randomUUID(),
            name: action.payload,
          },
        ],
      }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        selectedId: state.selectedId === action.payload ? null : state.selectedId,
      }
    case 'VIEW':
      return {
        ...state,
        selectedId: action.payload,
      }
    default:
      return state
  }
}

type ContextValue = {
  state: State
  dispatch: Dispatch<Action>
}

const ManagementContext = createContext<ContextValue | null>(null)

export function useManagement() {
  const ctx = useContext(ManagementContext)
  if (!ctx) throw new Error('useManagement must be used within ManagementProvider')
  return ctx
}

export function ManagementProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return (
    <ManagementContext.Provider value={value}>
      {children}
    </ManagementContext.Provider>
  )
}
