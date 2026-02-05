import { configureStore } from '@reduxjs/toolkit'
import temperatureReducer from '../temperatureSlice'
import { baseApi } from '@/app/lib/api'

export const store = configureStore({
    reducer: {
        temperature: temperatureReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
