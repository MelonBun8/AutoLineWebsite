import { createSlice } from '@reduxjs/toolkit'
// creating an RTK slice to handle actions, reducers, and types.
// this file handles managing our access token in redux state

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null },
    reducers: { // functions that can change / reduce the state. reducers is a key to an object with many keys (reducer names), each having an actual reducer function as value
        setCredentials: (state, action) => { // after logging in and getting the payload with accessToken from the server, we dispatch setCredentials to set the access token in our redux state
            const { accessToken } = action.payload
            state.token = accessToken
        },
        // eslint-disable-next-line no-unused-vars
        logOut: (state, action) => { // sets our redux state's token back to null / empty
            state.token = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions // these are both action creators (actions are events that occur in app based on user input)

export default authSlice.reducer // we export this as well because we need to add these to the store

export const selectCurrentToken = (state) => state.auth.token // lastly, create a selector (notice state.auth.token, auth is the name of our slice)