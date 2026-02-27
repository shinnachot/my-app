import { useReducer } from 'react'

export type FoodState = {
    foods: string[]
}

export type FoodAction =
    | { type: 'ADD_FOOD'; payload: string }
    | { type: 'REMOVE_FOOD'; payload: string }

const initialState: FoodState = {
    foods: []
}

function foodReducer(state: FoodState, action: FoodAction): FoodState {
    switch (action.type) {
        case 'ADD_FOOD':
            console.log(action.payload)
            return { ...state, foods: [...state.foods, action.payload] }
        case 'REMOVE_FOOD':
            return { ...state, foods: state.foods.filter((food) => food !== action.payload) }
        default:
            return state
    }
}

export const useFoodReducer = () => {
    const [state, dispatch] = useReducer(foodReducer, initialState)
    return { state, dispatch }
}
