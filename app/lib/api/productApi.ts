import { baseApi } from './baseApi'

/**
 * Product API endpoints
 * Public endpoints that don't require authentication
 */
export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all products
        getProducts: builder.query<Array<Record<string, unknown>>, void>({
            query: () => ({
                url: '/product',
                skipAuth: true // This endpoint doesn't require auth
            }),
            providesTags: ['Product']
        }),

        // Get single product by ID
        getProductById: builder.query<Record<string, unknown>, string>({
            query: (id) => ({
                url: `/product/${id}`,
                skipAuth: true
            }),
            providesTags: (result, error, id) => [{ type: 'Product', id }]
        })

        // Add more product endpoints here:
        // createProduct: builder.mutation<...>({...}),
        // updateProduct: builder.mutation<...>({...}),
        // deleteProduct: builder.mutation<...>({...}),
    })
})

// Export hooks for usage in functional components
export const { useGetProductsQuery, useGetProductByIdQuery } = productApi
