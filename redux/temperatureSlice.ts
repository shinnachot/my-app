import { createSelector, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'

export type TemperatureItem = {
    id: string
    valueC: number
    createdAt: string
}

type TemperatureState = {
    items: TemperatureItem[]
}

const initialState: TemperatureState = {
    items: []
}

export const temperatureSlice = createSlice({
    name: 'temperature',
    initialState,
    reducers: {
        temperatureAdded: {
            reducer: (state, action: PayloadAction<TemperatureItem>) => {
                state.items.unshift(action.payload)
            },
            prepare: (valueC: number) => {
                const payload: TemperatureItem = {
                    id: nanoid(),
                    valueC,
                    createdAt: new Date().toISOString()
                }
                return { payload }
            }
        },
        temperatureRemoved: (state, action: PayloadAction<{ id: string }>) => {
            state.items = state.items.filter((item) => item.id !== action.payload.id)
        },
        temperaturesCleared: (state) => {
            state.items = []
        }
    }
})

export const { temperatureAdded, temperatureRemoved, temperaturesCleared } =
    temperatureSlice.actions

export default temperatureSlice.reducer

export const selectTemperatureItems = (state: RootState) => state.temperature.items

export const selectTemperatureCount = createSelector(
    [selectTemperatureItems],
    (items) => items.length
)

export const selectTemperatureAverageC = createSelector(
    [selectTemperatureItems],
    (items: TemperatureItem[]) => {
        if (items.length === 0) return null
        const sum = items.reduce((acc: number, item: TemperatureItem) => acc + item.valueC, 0)
        return sum / items.length
    }
)
