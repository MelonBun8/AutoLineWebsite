// a wrapper component that wraps around everything we need to persist that needs the access token

// Check for a "persist" preference: See if the user opted to stay logged in (e.g., via a "Remember Me" checkbox).
// Attempt to get a new access token: If the user wants to persist and their access token is missing (e.g., after a page refresh), it tries to get a new one using a refresh token.
// Prevent UI flash/errors: It manages loading and error states to prevent the UI from showing unauthenticated content or error messages prematurely.
// Display content only when authenticated: It only renders the protected content (via Outlet) once a valid access token is available.

import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react' // hooks. Remember useref holds values across component mounts
import { useRefreshMutation } from './authApiSlice'
import usePersist from "../../hooks/usePersist"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./authSlice"
import PulseLoader from 'react-spinners/PulseLoader'

const PersistLogin = () => {

    const [persist] = usePersist() // our custom usePersist hook returns both value and setter, but we only extract persist
    const token = useSelector(selectCurrentToken) // get access token from redux store's auth slice 
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, { // extract refresh function and many states from mutation function in our RTKQuery authApiSlice.js file
        isUninitialized, // state for if refresh function called yet or not
        isLoading,
        isError,
        isSuccess,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        if(effectRan.current === true || (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.MODE !== 'development')) { // workaround to deal with react strict mode's double-run of useEffect during development. (Usually not a problem, sometimes, like below, we don't want that dual-run)
        // note I'm not using process.env like in tutorial cuz that's for Create React App, I'm using Vite, which has import.meta.env
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try{
                    // you can choose to log the refresh function's response access toekn here, but we'll take care of it within the refresh mutation function in the authApiSlice.js itself.
                    
                    // ALTERNATIVELY, we could've also imported useDispatch and setCredentials, dispatching the action creator to perform essentially the same task

                    // const response =
                    await refresh()
                    // const { accessToken } = response.data
                    // console.log( accessToken )
                    setTrueSuccess(true) // this helps add a flag to ensure credentials are actually set before isSuccess is called 

                }
                catch(err){
                    console.log(err)
                }
            }

            if(!token && persist) verifyRefreshToken() // if page refreshed and no access token found in local store, but persist mode is set to true during singup

        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, []) // no dependency as we only need above component to run once, when it mounts


    let content
    if(!persist){         
        console.log('No persist')
        content = <Outlet />

    } else if (isLoading) {
        console.log('Loading')
        content = <PulseLoader color={'#FFF'} />

    } else if (isError) { // one possibility is refresh token expiring
        console.log('error persist')
        content = (
            <p className = 'errmsg'>
                {`${error?.data?.message} - `}
                <Link to= '/login'>Please login again</Link>
            </p>
        )
    } else if (isSuccess && trueSuccess) { // remember from above, we need trueSuccess to give RTKQuery time to set the credentials
        console.log('success persist')
        content = <Outlet />

    } else if (token && isUninitialized){
        content = <Outlet />
    }
    

    return content
}

export default PersistLogin