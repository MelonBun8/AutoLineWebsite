import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({ // applies to every request we send on the baseURL, attaching an authorization header
    // with the access token
    baseUrl: 'https://autoline-showroom.onrender.com', // or your actual API URL (for production, changed to )
    credentials: 'include', // This ensures cookies are sent with every request
    prepareHeaders: (headers, { getState }) => { // specific fetchBaseQuery function that requires headers and an api object (we're destructuring getState from the api object ) 
        const token = getState().auth.token
        
        if (token) { // attaching auth header to access token (for JWT)
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => { // a wrapper for baseQuery for error handling (access token expired)
    //  console.log(args) //request url, method, body
    //  console.log(api) // signal, dispatch, getState() [Note this is separate from the baseQuery api object]
    //  console.log(extraOptions) // custom defined like {shout: True}, just for tutorial purposes
    
    // Execute the initial query 
    let result = await baseQuery(args, api, extraOptions)

    // If we get a 403 (Forbidden) response (likely our token expired), try to refresh the access token
    if (result?.error?.status === 403) {
        console.log('Sending refresh token')
        
        // Try to get a new access token by sending refresh token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) { // if refresh token still valid and new access token generated
            // Store the new token in redux store authSlice
            api.dispatch(setCredentials({ ...refreshResult.data })) // using spread operator but we could've just destructured too

            // Retry the original query with new refreshed access token 
            result = await baseQuery(args, api, extraOptions)
        } 

        else { // refresh token expired
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['DealReport', 'User', 'DeliveryLetter'],
    endpoints: builder => ({})
})
