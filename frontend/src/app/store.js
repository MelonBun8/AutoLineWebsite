import {configureStore} from "@reduxjs/toolkit";
import {apiSlice} from './api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from '../features/auth/authSlice'

// creating a redux store, where we might need to user redux devtools

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, // sets up reducer and it's path (automated by apiSlice's createApi)
        // notice that apiSlice.reducerPath is just the name of our global slice in api folder (apiSlice.js). 
        // apiSlice.reducer is auto-created by RTKquer to handle cache, loading flags, error handling etc.
        auth: authReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

setupListeners(store.dispatch) // This ensures at some regular intervals data is re-fetched to ensure data shown is not stale to anyone 
// viewing the tables/forms