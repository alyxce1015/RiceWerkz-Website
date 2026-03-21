import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container">
        <p className="footer-legal">
          &copy; {year} RiceWerkz. All rights reserved. Unauthorized use or reproduction of any content is prohibited.
        </p>
        <div className="footer-links">
          <Link to="/terms">Terms of Use</Link>
          <span>·</span>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
        <p className="footer-tagline">Built to be Driven</p>
        <p className="footer-credit">Website by Alyx Cui Edio</p>
      </div>
    </footer>
  )
}
