// wrapper to protect protected routes from being accessed just by typing in the URL and getting to the link 

import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'


const RequireAuth = ( {allowedRoles} ) => {
    const location = useLocation()
    const { roles } = useAuth()

    const content = (
        roles.some(role => allowedRoles.includes(role))
            ? <Outlet />
            : <Navigate to='/login' state = {{ from: location }} replace />
    )// if the user is Manager or Admin, or one of the allowed roles, only then do the children of this outlet load / mount
    // otherwise, the user is navigated back to the login page 

    return content
}

export default RequireAuth