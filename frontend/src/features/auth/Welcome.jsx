import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

import logo from '../../assets/logo.png'

const Welcome = () => {
  useTitle('Dash | Autoline')
  const { username, isManager, isAdmin } = useAuth()

  const date = new Date()
  const today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(date)

  return (
    <section className="welcome-hero">
      <div className="welcome-hero__text">
        <p className="welcome-hero__date">{today}</p>
        <h1 className="welcome-hero__title">Welcome, {username}!</h1>
        <div className="welcome-hero__actions">
          <Link to="/dash/deal-reports" className="hero-button">📋 View Deal Reports</Link>
          <Link to="/dash/deal-reports/new" className="hero-button">➕ New Deal Report</Link>
          <Link to="/dash/delivery-letters" className="hero-button">✉️ View Delivery Letters</Link>
          <Link to="/dash/delivery-letters/new" className="hero-button">➕ New Delivery Letter</Link>
          {(isManager || isAdmin) && (
            <>
              <Link to="/dash/users" className="hero-button">👤 View User Settings</Link>
              <Link to="/dash/users/new" className="hero-button">➕ Add New User</Link>
            </>
          )}
        </div>
      </div>
      <div className="welcome-hero__image">
        <img src={logo} alt="Autoline Logo" />
      </div>
    </section>
  )
}

export default Welcome
