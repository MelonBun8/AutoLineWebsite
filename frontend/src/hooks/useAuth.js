import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let isAdmin = false
    let status = "Employee" // stores highest role for each user

    if (token) {
        const decoded = jwtDecode(token)
        const {username, roles} = decoded.UserInfo // REMEMBER! In our authController.js, the login function, we 'signed' our JWT access token
        // with jwt.sign, and included the username and roles, which we're destructuring here

        isManager = roles.includes('Manager') // T or F if the roles list has Manager (remember, users can have multiple roles)
        isAdmin = roles.includes('Admin')

        if (isManager) status = "Manager"
        if (isAdmin) status = "Admin"
    
        return {  username, roles, status, isManager, isAdmin } 

    }
    
    return {  username: '', roles: [], isManager, isAdmin, status } 

}

export default useAuth