/* eslint-disable no-unused-vars */
import {createSelector, createEntityAdapter} from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({}) // creates an entity adapter, which helps you manage collections of items like users in redux state
// also comes with pre-built reducers like usersAdapter.addOne(), updateOne(), removeAll(), and setAll()

const initialState = usersAdapter.getInitialState() // initial state sets up an empty normalized state, which means it has a structure of 
// a JS object with an ids array, and a dictionary of entities with key being the id and entity being the actual saved item
// This is needed as ids can be iterated over, but entities can't
// eg: /*
// users: {
//     ids: [1, 2],
//     entities: {
//       1: { id: 1, name: 'Ali' },
//       2: { id: 2, name: 'Sameer' }
//     }
//   }

export const usersApiSlice = apiSlice.injectEndpoints({  // RTK query will create a hook based on the getUsers endpoint for us automatically when we define the endpoint
    endpoints: builder => ({ // adding / injecting an endpoint to the usersApiSlice, which in turn injects into the main apiSlice for Redux RTK query 
        
        getUsers: builder.query({ // define a query endpoint (The GET endpoint / query / retriever)
            query: () =>  ({
                url: '/users', // since baseURL already set in apiSlice.js, this will create the whole backend URL
                validateStatus: (response, result) => { // what happens in a successful response
                    return response.status === 200 && !result.isError // we add isError check as well cuz Redux API has a quirk where it always sends 200 even for faulty responses.
                },
            }),
            // keepUnusedDataFor: 5, // how long to keep cached data for this query in redux store after last component stops using it (unsubscribes from it) [for now at 5 seconds only for dev purposes, usually 60 seconds or so]
            // default value for above is 60 sec. Note that this timer only activates once no component has a subscription to it anymore. 
            // OUr UsersList fetches it but the immediately unsubscribes. To prevent that, we setup Prefetch for protected pages in auth.
            
            transformResponse: responseData => { // process raw data received from backend before storing in redux
                const loadedUsers = responseData.map(user => { // normalize data for frontend
                    user.id = user._id // we convert the _id property to id because of our data normalization above (getInitialState) which looks for an id property, not _id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers) // uses RTK createEntityAdapter, (an adapter manages user entities, handles reducers, selectors, and normalizing storing data) to finally set the normalized data in redux store
            },
            providesTags: (result, error, arg) => { // caching invalidation
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),

        addNewUser: builder.mutation({ // notice how this is a MUTATION, not a query, as it changes state
            query: initialUserData => ({ // assigns object initialUserData to query property/key, which needs a function
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags:[ // to invalidate cache and force it to update (update the UsersList)
                {type: 'User', id: "LIST"}
            ]
        }),

        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body:{
                    ...initialUserData // spread syntax to pass the whole initialUserData destructured into an object passed into the body property
                } // we use the spread operator to essentially pass by value, not by reference
            }),
            invalidatesTags: (result, error, arg) => [ // invalidates tags function, the stuff in the square brackets is its return value
                { type: 'User', id: arg.id } //invalidates only that specific user that's updated, only that user ID
                // sine only one statement needs to execute in this function body, we can omit the curly brackets
            ]
        }),

        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id } // since to delete a user, we just need to pass in the id of the user to be deleted
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }), // now after adding the mutation endpoints for CUD of CRUD, RTK query automatically creates hooks for us

    }),
})

export const { // exporting the auto-generated hooks by RTK. This manages data fetching lifecycle, returns object with data, errors, etc.
    useGetUsersQuery, // hooks have 'use' prepended and query/mutation appended
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApiSlice

// now creating some selectors:::::

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector( // not exporting as it's only needed in below selector
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const { 
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState) 
// get selectors generates a set of pre-built selectors that know how to read data from the normalized entity structure that the adapter manages
// ?? initialState is a fallback
// ?? is nullish coalescing operator, returning right hand side operand when left is null / undefined