import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const Welcome = () => {

    useTitle('Dash | Autoline')

    const { username, isManager, isAdmin } = useAuth()
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (

        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {username}!</h1>

            {/* Remember, we only want Managers and Admins to view new user settings and add new users */}
            
            <p><Link to="/dash/deal-reports">View Deal Reports</Link></p>
            <p><Link to="/dash/deal-reports/new">Add New Deal Report</Link></p>

            {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}
            {/* Above is an example of SHORT CIRCUITING in JS, where && or || operators are used for a short conditional
            X && Y will return X if X is 'falsy' and Y if X is 'truthy' (for multiple truthy-s, last truthy returned)
            X || Y is opposite to && in the sense it returns the first truthy or last falsy if all are falsy */}
            {(isManager || isAdmin) &&<p><Link to="/dash/users/new">Add New User</Link></p>}

        </section>
    )

    return content
}

export default Welcome