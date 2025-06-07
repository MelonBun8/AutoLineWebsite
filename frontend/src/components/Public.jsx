import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">AutoLine Showroom</span></h1>
            </header>
            <main className="public__main">
                <p>Located near Quaid-e-Azam Mizaar, Autoline Showroom  provides a trained staff ready to meet your automobile needs.</p>
                <address className="public__addr">
                    Autoline Showroom<br />
                    V3M4+V45، Near shell petrol pump<br />
                    Hyderabad Colony, Karachi<br />
                    <a href="tel:+2134860058">(021) 34860058</a>
                </address>
                <br />
                <p>Owner: Nomaan Ahmed Siddiqui</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public