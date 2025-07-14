import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const Public = () => {
  return (
    <section className="public-hero">
      <div className="public-hero__content">
        <h1 className="public-hero__title">
          Welcome to <span className="nowrap">AutoLine Showroom</span>
        </h1>
        <p className="public-hero__desc">
          Located near Quaid-e-Azam Mazar, Autoline Showroom provides a trained staff ready to meet your automobile needs.
        </p>
        <address className="public-hero__addr">
          <strong>Autoline Showroom</strong><br />
          V3M4+V45، Near Shell Petrol Pump<br />
          Hyderabad Colony, Karachi<br />
          <a href="tel:+2134860058">(021) 34860058</a>
        </address>
        <p className="public-hero__owner">Owner: Nomaan Ahmed Siddiqui</p>
        <Link to="/login" className="hero-button">Employee Login</Link>
      </div>
      <div className="public-hero__image">
        <img src={logo} alt="Autoline Logo" />
      </div>
    </section>
  )
}

export default Public
