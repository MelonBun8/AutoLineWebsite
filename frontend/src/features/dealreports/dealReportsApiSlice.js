/* eslint-disable no-unused-vars */
import {createSelector, createEntityAdapter} from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice'

const dealReportsAdapter = createEntityAdapter({
    // Just an FYI since the tutorial showed it and you deffo WILL need it when you implement the search, sort and filter feature later on.
    // sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1 
    // The above comparer places completed notes at bottom, open notes at top
}) 
const initialState = dealReportsAdapter.getInitialState() 


export const dealReportsApiSlice = apiSlice.injectEndpoints({  // RTK query will create a hook based on the getDealReports endpoint for us automatically when we define the endpoint
    endpoints: builder => ({ // adding an endpoint to the dealReportsApiSlice
        
        getDealReports: builder.query({ // define a query endpoint
            
            query: () => ({
                url: '/deal-reports', // since baseURL already set in apiSlice.js, this will create the whole backend URL
                validateStatus: (response, result) => {return response.status === 200 && !result.isError}, // what happens in a successful response
                // note how the isError we set in the backend is being used here
            }), // we add isError check as well cuz Redux API has a quirk where it always sends 200 even for faulty responses.
            // keepUnusedDataFor: 5, // how long to keep cached data for this query in redux store after last component stops using it (unsubscribes from it) [for now at 5 seconds only for dev purposes, usually 60 seconds or so]
            
            transformResponse: responseData => { // process raw data received from backend before storing in redux
                const loadedDealReports = responseData.map(dealReport => { // normalize data for frontend
                    dealReport.id = dealReport._id // we convert the _id property to id because of our data normalization above (getInitialState) which looks for an id property, not _id
                    return dealReport
                });
                return dealReportsAdapter.setAll(initialState, loadedDealReports) 
            },
            
            providesTags: (result, error, arg) => { 
                if (result?.ids) {
                    return [
                        { type: 'DealReport', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'DealReport', id }))
                    ]
                } else return [{ type: 'DealReport', id: 'LIST' }]
            }
        }),

        addNewDealReport: builder.mutation({
            query: initialDealReport => ({
                url: '/deal-reports',
                method: 'POST',
                body: {
                    ...initialDealReport
                }
            }),

            invalidatesTags: [
                {type: "DealReport", id: "LIST"} 
            ]
        }),

        updateDealReport: builder.mutation({
            query: initialDealReport => ({
                url: '/deal-reports',
                method: 'PATCH',
                body: {
                    ...initialDealReport
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'DealReport', id: arg.id }
            ]
        }),

        deleteDealReport: builder.mutation({
            query: ( { id } ) => ({
                url: '/deal-reports',
                method: 'DELETE',
                body: { id }
            }),
           
            invalidatesTags: (result, error, arg) => [
                {type: "DealReport", id: arg.id}
            ]
        })

    }),
})

export const { 
    useGetDealReportsQuery,
    useUpdateDealReportMutation,
    useAddNewDealReportMutation,
    useDeleteDealReportMutation,
} = dealReportsApiSlice

export const selectDealReportsResult = dealReportsApiSlice.endpoints.getDealReports.select()

const selectDealReportsData = createSelector( 
    selectDealReportsResult,
    dealReportsResult => dealReportsResult.data 
)

export const { 
    selectAll: selectAllDealReports,
    selectById: selectDealReportById,
    selectIds: selectDealReportIds

} = dealReportsAdapter.getSelectors(state => selectDealReportsData(state) ?? initialState) 