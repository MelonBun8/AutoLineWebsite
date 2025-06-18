import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const DashFooter = () => {
    
    const { username, status } = useAuth()

    const navigate = useNavigate() // used to move to another page / path of website
    const { pathname } = useLocation() // get current page's path
    
    const onGoHomeClicked = () => navigate('/dash') // move to home page / dashboard (when logged in, as footer only appears when logged in)

    let goHomeButton = null
    if (pathname !== '/dash') {  // IF we aren't already on the home page
        // parenthesis usually helps if you need your code broken into separate lines
        // title of an HTML element is what shows when it's hovered over
        goHomeButton = (
            <button 
                className = "dash-footer__button icon-button"
                title="Home"
                onClick = {onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        ) 
    }

    // footer will display current user in the footer status bar 
    // (goHomeButton will have value null and not be rendered if the user is already on the home / dashboard page)
    const content = (
        <footer className = "dash-footer">
            {goHomeButton} 
            <p>Current User: {username}</p>
            <p>Status: {status}</p>
        </footer>
    )

    return content;
}

export default DashFooter
