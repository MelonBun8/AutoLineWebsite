import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

// RTK Query used code splitting, an initial slice defined in apiSlice, then endpoints setup in different files based on website and data structure.

// selectors are functions that get data from redux store. createSelector creates a memoizedSelector, that only recalculates/ re-fetches it's output if the input (slice(s) the selector depends on) changes
// entity adapters help manage normalized redux state (normalized means optimized for id lookup, preventing duplicates and simpler updates) It provides pre-built reducers (functions that take current state and an action as args and return a new state) and selectors. 

const deliveryLettersAdapter = createEntityAdapter({ // auto-chooses 'id' as the primary key
    // empty for now, will add sorting features through this later
})

const initialState = deliveryLettersAdapter.getInitialState() // setup normalized state, with an {ids:[], entities:{}} object. ids based on added order OR sorted order if setup in entity adapter above


export const deliveryLettersApiSlice = apiSlice.injectEndpoints({ // define and inject API endpoints to base apiSlice

    endpoints: builder => ({
        getDeliveryLetters: builder.query({
            query: ({ filters } = {}) => { 
                if (filters && Object.keys(filters).length > 0) {
                    return {
                        url: '/delivery-letters/search/filter',
                        params: filters,
                        validateStatus: (response, result) =>
                            response.status === 200 && !result.isError
                    }
                }
                return {
                    url: '/delivery-letters',
                    validateStatus: (response, result) =>
                        response.status === 200 && !result.isError
                }
            },

            transformResponse: (responseData) => {
                const loadedDeliveryLetters = responseData.map(deliveryLetter => {
                    deliveryLetter.id = deliveryLetter._id
                    return deliveryLetter
                })
                return deliveryLettersAdapter.setAll(initialState, loadedDeliveryLetters)
            },

            providesTags: (result) => {
                if (result?.ids) {
                    return [
                        { type: "DeliveryLetter", id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'DeliveryLetter', id }))
                    ]
                } else {
                    return [{ type: "DeliveryLetter", id: "LIST" }]
                }
            }
        }),

        getDeliveryLetter: builder.query({
            
            query: (id) => ({
                url: `/delivery-letters/${id}`,
                validateStatus: (response, result) => { return response.status === 200 && !result.isError }
            }),

            transformResponse: responseData => {
                const transformedData = {...responseData}
                transformedData.id = transformedData._id  // since only one delivery letter
                return transformedData
            },

            providesTags: (result, _error, arg) => {
                if(result) { return [
                    { type:"DeliveryLetter", id:"LIST" }, 
                    {type:"DeliveryLetter", id:arg}
                ]}
                else return [{ type:"DeliveryLetter", id:"LIST" }] // this type is a tag setup in apiSlice
            }   

        }),
        
        addNewDeliveryLetter: builder.mutation({
            query: ({username, data}) => ({
                url:`/delivery-letters`,
                method:'POST',
                body: {username, ...data}
            }),

            invalidatesTags: () => [{type:'DeliveryLetter', id:"LIST"}]
        }),

        updateDeliveryLetter: builder.mutation({
            query: ({id, ...patchData}) => ({
                url:`/delivery-letters/${id}`,
                method:'PATCH',
                body: patchData
            }),

            invalidatesTags: (results, error, {id}) => [
                { type: 'DeliveryLetter', id: 'LIST' },
                {type:'DeliveryLetter', id:id}
            ]
        }),
        
        deleteDeliveryLetter: builder.mutation({
            query: (id) => ({
                url:`/delivery-letters/${id}`,
                method:'DELETE'
            }),
            
            invalidatesTags: (_results, _error, arg) => [
                { type: 'DeliveryLetter', id: 'LIST' },
                {type:'DeliveryLetter', id:arg}
            ]
        }) 

    })


})

export const { // RTKQuery auto-generates these react hooks based on your endpoints for you
    useGetDeliveryLetterQuery,
    useGetDeliveryLettersQuery,
    useAddNewDeliveryLetterMutation,
    useUpdateDeliveryLetterMutation,
    useDeleteDeliveryLetterMutation
} = deliveryLettersApiSlice
// useXYZQuery Hooks ABOVE: These hooks are primarily responsible for initiating the data fetching process, managing the query's lifecycle (loading, success, error states), and providing the fetched data (along with its status) directly to your React components. They are your direct interface to the API call.

// Custom Selectors BELOW: These selectors are purely for reading and deriving data from an already existing Redux store state (the RTK Query cache). They do not initiate any network requests; they only work with data that has already been fetched and cached.
export const selectDeliveryLettersResult = deliveryLettersApiSlice.endpoints.getDeliveryLetters.select() // create memoized selector to get all DeliveryLetters

const selectDeliveryLettersData = createSelector(
    selectDeliveryLettersResult, 
    deliveryLettersResult => deliveryLettersResult.data
) // for getting JUSt memoized data, not any extra fluff like isLoading, isErrors etc.

export const { 
    selectAll: selectAllDeliveryLetters,
    selectById: selectDeliveryLetterById,
    selectIds: selectDeliveryLetterIds

} = deliveryLettersAdapter.getSelectors(state => selectDeliveryLettersData(state) ?? initialState) 

// NOTE: RTK Query manages its cache on a per-endpoint and per-argument basis. Each query endpoint (getDeliveryLetters, getDeliveryLetter, getFilteredDeliveryLetters) has its own independent cache entry (or entries, if called with different arguments).

