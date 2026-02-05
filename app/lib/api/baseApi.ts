import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError
} from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react'
import { getAccessToken, setTokens } from '../tokenManager'

const baseURL = process.env.NEXT_PUBLIC_APP_ENDPOINT

if (!baseURL) {
    console.warn('NEXT_PUBLIC_APP_ENDPOINT is not set; API baseURL will be empty.')
}

/**
 * Extended FetchArgs to support skipAuth option
 */
interface CustomFetchArgs extends FetchArgs {
    skipAuth?: boolean
}

/**
 * Custom base query that handles:
 * - Token injection from NextAuth session
 * - Automatic token refresh on 401 errors
 * - Skip auth option for public endpoints
 */
const baseQuery = fetchBaseQuery({
    baseUrl: baseURL || '',
    prepareHeaders: async (headers, { extra }) => {
        // Check if skipAuth is set in extra
        const skipAuth = (extra as { skipAuth?: boolean })?.skipAuth
        if (skipAuth) {
            return headers
        }

        // Get access token from memory cache or NextAuth session
        const accessToken = await getAccessToken()
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }

        return headers
    }
})

/**
 * Base query with retry logic for 401 errors
 * Automatically refreshes token and retries the request
 */
export const baseQueryWithReauth: BaseQueryFn<
    string | CustomFetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // Extract skipAuth from args (if it's an object with skipAuth property)
    let skipAuth = false
    if (typeof args === 'object' && args !== null && 'skipAuth' in args) {
        skipAuth = args.skipAuth || false
    }

    // Prepare query args - remove skipAuth from the query object before passing to baseQuery
    const queryArgs =
        typeof args === 'string'
            ? args
            : (() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { skipAuth, ...rest } = args
                  return rest as FetchArgs
              })()

    // Pass skipAuth through extraOptions so prepareHeaders can access it
    const existingExtra =
        extraOptions && 'extra' in extraOptions
            ? (extraOptions.extra as Record<string, unknown>)
            : undefined
    const optionsWithSkipAuth = {
        ...extraOptions,
        extra: existingExtra ? { ...existingExtra, skipAuth } : { skipAuth }
    }

    // If skipAuth is true, call baseQuery without retry logic
    if (skipAuth) {
        return baseQuery(queryArgs, api, optionsWithSkipAuth)
    }

    // First attempt
    let result = await baseQuery(queryArgs, api, optionsWithSkipAuth)

    // If 401 and not already retried, try to refresh token
    if (result.error?.status === 401) {
        // Trigger NextAuth to refresh token server-side
        const session = await getSession()
        const newAccessToken = session?.user?.accessToken

        if (newAccessToken) {
            // Update token in memory
            setTokens({ accessToken: newAccessToken })

            // Retry the original request with new token
            result = await baseQuery(queryArgs, api, optionsWithSkipAuth)
        }
    }

    return result
}

/**
 * Base API slice with empty endpoints
 * Other feature APIs will inject their endpoints here using injectEndpoints
 */
export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Product', 'Task'], // Add more tag types as needed
    endpoints: () => ({}) // Empty endpoints - will be injected by feature APIs
})
