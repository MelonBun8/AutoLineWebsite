import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
// You actually don't need to import 'React' from react anymore in newer versions of react and Vite, since they automatically take care of adding it during JSX transformation /
// Modern browsers use JIT (just in time) compilation, where it starts interpreted, and the frequently used sections are compiled!! 
// Also note that  TypeScript is different, it's Ahead of Time (AOT compiled), before the browser ever sees it.


// setting up regex to compare to url and understand which path we are currently on to decide what to display
const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) {
            console.log('isSuccess for logout!')
            navigate('/')
        }
    }, [isSuccess, navigate])

    if (isLoading) {
        console.log("Loading right now...")
        return <p>Logging Out...</p>
    }

    if (isError) {
        console.log("Got an error...")
        return <p>Error: {error.data?.message}</p>
    }

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) { // if we're not on ly of the dash, notes list, or users list pages:
        dashClass = "dash-header__container--small"
    } // could do it with a ternary too 
    
    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const content = (
        <header className="dash-header">
            <div className={`dash-header__container ${dashClass}`}>
                <Link to="/dash">
                    <h1 className="dash-header__title">Autoline Showroom</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* add more buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )

    return content
}
export default DashHeader