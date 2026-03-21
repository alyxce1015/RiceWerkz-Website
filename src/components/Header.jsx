import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Header({ brand = { type: 'logo' }, showHomeLinks = false, backTo = null }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  function openMenu() {
    setMenuOpen(true)
    document.body.style.overflow = 'hidden'
  }

  function closeMenu() {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  function toggleMenu(e) {
    e.preventDefault()
    menuOpen ? closeMenu() : openMenu()
  }

  function handleNavClick(e, href) {
    if (href.startsWith('#')) {
      e.preventDefault()
      closeMenu()
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      closeMenu()
    }
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') closeMenu()
    }
    function handleResize() {
      if (window.innerWidth > 768) closeMenu()
    }
    document.addEventListener('keydown', handleKey)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Close menu on route change
  useEffect(() => { closeMenu() }, [location.pathname])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'RW Cars', href: '/cars' },
    { label: 'All Parts', href: '/parts' },
    { label: 'Gallery', href: '/gallery' },
    ...(isHome ? [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ] : []),
  ]

  const brandContent = brand.type === 'logo'
    ? <img src="/assets/images/RW_favicon.png" alt="RiceWerkz Logo" />
    : <span className="brand-text">{brand.text}</span>

  return (
    <>
      <header className="site-header">
        <div className="container">
          {backTo && (
            <button className="header-back" onClick={() => navigate(backTo)} aria-label="Go back">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Back
            </button>
          )}
          {!backTo && !isHome && (
            <button className="header-back mobile-back" onClick={() => navigate(-1)} aria-label="Go back">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Back
            </button>
          )}
          <h1 className="brand">{brandContent}</h1>

          <nav className="nav">
            {navLinks.map(link =>
              link.href.startsWith('#') ? (
                <a key={link.label} href={link.href} onClick={e => handleNavClick(e, link.href)}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.href}>{link.label}</Link>
              )
            )}
          </nav>

          <button
            className={`mobile-menu-toggle${menuOpen ? ' active' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onPointerDown={toggleMenu}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div
        className={`mobile-nav-overlay${menuOpen ? ' active' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) closeMenu() }}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-nav">
          {navLinks.map(link =>
            link.href.startsWith('#') ? (
              <a key={link.label} href={link.href} onClick={e => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            ) : (
              <Link key={link.label} to={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  )
}
