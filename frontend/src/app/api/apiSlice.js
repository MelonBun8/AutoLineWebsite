/* eslint-disable no-unused-vars */
 import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// below is RTK, pure Redux would have a LOT more boilerplate, including manually defining actions, action creators and reducers (pure functions that listen for specific actions and then decide how to update the application's state based on them)
// Note: a "slice" is a piece of the redux store, handling a specific part of app state
 export const apiSlice = createApi({ // this apiSlice will have all the API endpoints to connect frontend to backend
     baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3500'}), // this sets up the baseurl for all other API calls
     tagTypes: ['DealReport', 'User'], // identify different data the API endpoints fetch (helps manage cache invalidation)
     endpoints: builder => ({})
 })

// // Assuming this is your app/api/apiSlice.js file
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { setCredentials } from '../../features/auth/authSlice'

// const baseQuery = fetchBaseQuery({
//     baseUrl: 'http://localhost:3500', // or your actual API URL
//     credentials: 'include', // This ensures cookies are sent with every request
//     prepareHeaders: (headers, { getState }) => {
//         const token = getState().auth.token
        
//         if (token) {
//             headers.set("authorization", `Bearer ${token}`)
//         }
//         return headers
//     }
// })

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//     // Execute the initial query
//     let result = await baseQuery(args, api, extraOptions)

//     // If we get a 403 (Forbidden) response, try to refresh the token
//     if (result?.error?.status === 403) {
//         console.log('Sending refresh token')
        
//         // Try to get a new access token
//         const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

//         if (refreshResult?.data) {
//             // Store the new token
//             api.dispatch(setCredentials({ ...refreshResult.data }))

//             // Retry the original query with new access token
//             result = await baseQuery(args, api, extraOptions)
//         } else {
//             if (refreshResult?.error?.status === 403) {
//                 refreshResult.error.data.message = "Your login has expired."
//             }
//             return refreshResult
//         }
//     }
//     return result
// }

// export const apiSlice = createApi({
//     baseQuery: baseQueryWithReauth,
//     tagTypes: ['Note', 'User'],
//     endpoints: builder => ({})
// })
