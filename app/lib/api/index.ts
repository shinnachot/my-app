/**
 * Centralized API exports
 * Import from here instead of individual files
 */

// Export base API (needed for store configuration)
export { baseApi } from './baseApi'

// Export product API hooks
export { useGetProductsQuery, useGetProductByIdQuery } from './productApi'

// Export task API hooks
export { useGetTasksQuery, useGetTaskByIdQuery } from './taskApi'

// Re-export baseApi as apiSlice for backward compatibility
export { baseApi as apiSlice } from './baseApi'
