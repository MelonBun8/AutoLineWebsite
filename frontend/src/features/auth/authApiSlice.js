/* eslint-disable no-unused-vars */
import { apiSlice } from '../../app/api/apiSlice'
import { logOut, setCredentials } from '../auth/authSlice' // logout and setCredentials are reducer / action creators gotten from authSlice.actions

export const authApiSlice = apiSlice.injectEndpoints({ // all these are mutation functions that can manipulate the redux store

    endpoints: builder => ({
        
        login: builder.mutation({ 
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),

        sendLogout: builder.mutation({
            query: () => {
                // console.log('sendLogout query function called')
                return {
                    url: '/auth/logout',
                    method: 'POST',
                    credentials: 'include'
                }
            },
            async onQueryStarted(navigate, { dispatch, queryFulfilled }) {
                // console.log('sendLogout onQueryStarted called')
                try {
                    const result = await queryFulfilled
                    // console.log('queryFulfilled successful:', result)
    
                    dispatch(logOut())
                    // Use navigate for consistency
                    if (navigate && typeof navigate === 'function') {  
                        navigate('/') 
                    }

                    setTimeout(()=>{ // some kinda bug in tutorial where accessToken requests continuously sent even after logging out
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                    

                    // setTimeout(() => { // not using this method as it's hacky
                    //     dispatch(apiSlice.util.resetApiState())
                    // }, 500) // Small delay to allow isSuccess to activate and successfully navigate back to front public page
                    
                    

                    console.log('🎉 Logout process completed successfully')
                } catch (err) {
                    // console.error('❌ queryFulfilled failed:', err)
                    // console.error('❌ Error status:', err.status)
                    // console.error('❌ Error data:', err.data)
                }
            }
        }),

        refresh: builder.mutation({ // this does not manipulate the redux state, simply calls backend route with GET request 
            query: () => ({ // NOTE: While this function doesn't directly manipulate redux state, it does indirectly, by having a new accessToken generated, thus better to treat as mutation
                url: '/auth/refresh',
                method: 'GET',
             }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) { // setting up this onQueryStarted prevents the need to import the
                // setCredentials action creator + useDispatch in EVERY component where we want the refresh logic 
                // (This allows us to, anywhere we use the refresh mutation, to automatically setCredentials in the redux store as well)
                try {
                    const { data } = await queryFulfilled
                    console.log(data) // the data would be the access token
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                 } 
                 catch (err) {
                     console.log(err)
                 }
             }
        }),
    
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
} = authApiSlice // destructuring auto-created react hooks for each endpoint 
// eg: for login mutation endpoint, RTKQuery auto generates an object: const [login, { data, isLoading, error }] = useLoginMutation();  