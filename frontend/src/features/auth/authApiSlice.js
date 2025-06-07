import { apiSlice } from '../../app/api/apiSlice'
import { logOut } from '../auth/authSlice' // logout is a reducer / action creator gotten from authSlice.actions

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
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                credentials: 'include'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) { // onQueryStarted is provided by RTKquery inside our endpoint
                try { // it needs an arg that we're not using, and dispacth and queryFulfilled (evident from name)
                    await queryFulfilled
                    dispatch(logOut()) // dispatch reducer we got from authSlice (sets token to null in local state)
                    dispatch(apiSlice.util.resetApiState()) // to clear the apiSlice as well (clearing cache and query subscriptions)
                } catch (err) {
                    console.log(err)
                } // doing all the above inside an onQueryStarted removes the need to import useDispatch into a component, and dispatching each ove these in every component. (Takes care of it when logout endpoint is called)
            }
        }),

        refresh: builder.mutation({ // this does not manipulate the redux state, simply calls backend route with GET request 
            query: () => ({ // NOTE: While this function doesn't directly manipulate redux state, it does indirectly, by having a new accessToken generated, thus better to treat as mutation
                url: '/auth/refresh',
                method: 'GET',
            }),
            // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            //     try {
            //         const { data } = await queryFulfilled
            //         console.log(data)
            //         const { accessToken } = data
            //         dispatch(setCredentials({ accessToken }))
            //     } catch (err) {
            //         console.log(err)
            //     }
            // }
        }),
    
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
} = authApiSlice // destructuring auto-created react hooks for each endpoint 
// eg: for login mutation endpoint, RTKQuery auto generates an object: const [login, { data, isLoading, error }] = useLoginMutation();  