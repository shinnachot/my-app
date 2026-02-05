import { baseApi } from './baseApi'

/**
 * Task API endpoints
 * Requires authentication
 */
export const taskApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all tasks
        getTasks: builder.query<Array<Record<string, unknown>>, void>({
            query: () => '/tasks', // This endpoint requires auth
            providesTags: ['Task']
        }),

        // Get single task by ID
        getTaskById: builder.query<Record<string, unknown>, string>({
            query: (id) => `/tasks/${id}`,
            providesTags: (result, error, id) => [{ type: 'Task', id }]
        })

        // Add more task endpoints here:
        // createTask: builder.mutation<...>({...}),
        // updateTask: builder.mutation<...>({...}),
        // deleteTask: builder.mutation<...>({...}),
    })
})

// Export hooks for usage in functional components
export const { useGetTasksQuery, useGetTaskByIdQuery } = taskApi
