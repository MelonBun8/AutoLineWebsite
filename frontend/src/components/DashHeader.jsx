import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faRightFromBracket,
    faFilePen,
    faUserGear,
    faUserPlus,
    faFileCirclePlus
} from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'

// You actually don't need to import 'React' from react anymore in newer versions of react and Vite, since they automatically take care of adding it during JSX transformation /
// Modern browsers use JIT (just in time) compilation, where it starts interpreted, and the frequently used sections are compiled!! 
// Also note that  TypeScript is different, it's Ahead of Time (AOT compiled), before the browser ever sees it.


// setting up regex to compare to url and understand which path we are currently on to decide what to display
const DASH_REGEX = /^\/dash(\/)?$/
const DEALREPORTS_REGEX = /^\/dash\/deal-reports(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {

    const { isManager, isAdmin } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation() // useLocation is a hook, a hook is a special function provided by React (or React libraries) that lets you "hook into" React features like state and lifecycle methods from functional components.
 
    const [sendLogout, {
        isLoading,
        // isSuccess, // not using isSuccess since routing to root page now handled within authApiSlice's logout mutation method 
        // (This was done because we were having issues with Api State being reset, and component would dismount before isSuccess could
        // successfully activate and run the isSuccess iseEffect, using a timeout is hacky and unreliable thus this was ultimately done.)
        isError,
        error
    }] = useSendLogoutMutation()

    // useEffect(() => { // see commented isSuccess for details
    //     if (isSuccess) {
    //         console.log('DashHeader - Logout isSuccess triggered, navigating!')
    //         navigate('/')
    //     }
    // }, [isSuccess, navigate])

    const handleLogout = () => {
        sendLogout(navigate)
    }

    const onNewDealReportClicked = () => navigate('./deal-reports/new')
    const onNewUserClicked = () => navigate('./users/new')
    const onDealReportsClicked = () => navigate('./deal-reports')
    const onUsersClicked = () => navigate('./users')

    let dashClass = null
    if (!DASH_REGEX.test(pathname) && !DEALREPORTS_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) { // if we're not on any of the dash, notes list, or users list pages:
        dashClass = "dash-header__container--small"
    } // could do it with a ternary too 
    
    let newDealReportButton = null
    if (DEALREPORTS_REGEX.test(pathname)) { // only display this on the deal reports page
        newDealReportButton = (
            <button 
                className="icon-button"
                title = "New Deal Report"
                onClick = {onNewDealReportClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname)) { // only display this on the users page (which only admins / managers can reach, thus implicit layered auth)
        newUserButton = (
            <button
                className="icon-button"
                title = "New User"
                onClick = {onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    let userButton = null
    if (isManager || isAdmin) { // if correct authorization
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) { // if on any protected route (dash in URL path + not on users page)
            userButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    let dealReportsButton = null
    if (!DEALREPORTS_REGEX.test(pathname) && pathname.includes('/dash')) {
        dealReportsButton = (
            <button
                className="icon-button"
                title="Deal Reports"
                onClick={onDealReportsClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={handleLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    const errClass = isError ? "errmsg" : "offscreen"

    let buttonContent
    if (isLoading) {
        buttonContent = <p>Logging Out...</p>
    } else {
        buttonContent = <>
            {newUserButton}
            {newDealReportButton}
            {userButton}
            {dealReportsButton}
            {logoutButton}
        </>
    }

    const content = (
        <>
            {/* IF any error faced, display it in a different way using errClass */}
            <p className = {errClass}>{error?.data?.message}</p>
            
            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">Autoline Showroom</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default DashHeader