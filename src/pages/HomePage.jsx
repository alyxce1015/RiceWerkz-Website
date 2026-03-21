import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { coreMembers } from '../data/members'

// ─── CLOUDINARY CONFIG ────────────────────────────────────────────────────────
// Values come from .env (see .env.example for setup instructions)
// CHANGE 1: Set VITE_CLOUDINARY_CLOUD_NAME in your .env file
// CHANGE 2: Set VITE_CLOUDINARY_HERO_TAG to the tag you apply to hero images in Cloudinary
// CHANGE 3: Enable "Resource list" in Cloudinary Console → Settings → Security
// ─────────────────────────────────────────────────────────────────────────────
const CLOUD_NAME  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const HERO_TAG    = import.meta.env.VITE_CLOUDINARY_HERO_TAG
const GALLERY_TAG = import.meta.env.VITE_CLOUDINARY_GALLERY_TAG

// ─── CAROUSEL SPEEDS ──────────────────────────────────────────────────────────
const HERO_INTERVAL_MS  = 2200  // ms between hero slide transitions
const GALLERY_SCROLL_S  = 15    // seconds for one full gallery loop
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK_SLIDES = [
  '/assets/images/RW.jpg',
  '/assets/images/WRX_Cinematic.PNG',
  '/assets/images/WRX_roller.PNG',
]

const FALLBACK_GALLERY = [
  '/assets/images/WRX_Cinematic.PNG',
  '/assets/images/WRX_roller.PNG',
  '/assets/images/RW 1.PNG',
]

function fetchByTag(tag) {
  return fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`)
    .then(res => res.json())
    .then(data => {
      if (data.resources && data.resources.length > 0) {
        return data.resources.map(
          r => `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${r.public_id}`
        )
      }
      return null
    })
    .catch(() => null)
}

export default function HomePage() {
  const [heroSlides, setHeroSlides]     = useState(FALLBACK_SLIDES)
  const [galleryImages, setGalleryImages] = useState(FALLBACK_GALLERY)
  const [activeSlide, setActiveSlide]   = useState(0)
  const [mobileSlide, setMobileSlide]   = useState(0)
  const touchStartX = useRef(null)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const mobileSlides = galleryImages.slice(0, 3)

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) setMobileSlide(i => (i + 1) % mobileSlides.length)
      else          setMobileSlide(i => (i - 1 + mobileSlides.length) % mobileSlides.length)
    }
    touchStartX.current = null
  }

  useEffect(() => {
    fetchByTag(HERO_TAG).then(urls => {
      if (urls) { setHeroSlides(urls); setActiveSlide(0) }
    })
    fetchByTag(GALLERY_TAG).then(urls => {
      if (urls) setGalleryImages(urls)
    })
  }, [])

  useEffect(() => {
    if (prefersReduced) return
    const timer = setInterval(() => {
      setActiveSlide(i => (i + 1) % heroSlides.length)
    }, HERO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [prefersReduced, heroSlides])

  return (
    <>
      <Header brand={{ type: 'logo' }} />

      <main>
        {/* Hero */}
        <section id="home" className="home">
          <div className="container home-inner">
            <div className="home-image" aria-hidden="true">
              {heroSlides.map((src, i) => (
                <img
                  key={src}
                  className={`home-slide${i === activeSlide ? ' active' : ''}`}
                  src={src}
                  alt="Car photo"
                />
              ))}
            </div>
            <div className="home-copy">
              <h2>RiceWerkz</h2>
              <p className="lead">Built to be driven</p>
            </div>
          </div>
        </section>

        {/* Members */}
        <section id="members_cars" className="container members_cars">
          <h3 className="section-title">Members</h3>
          <div className="member-grid">
            {coreMembers.map(member => (
              <Link key={member.id} to={`/cars/${member.id}`}>
                <div className="member">
                  <h4>{member.name}</h4>
                  <p>{member.cardLabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="container gallery">
          <h3 className="section-title">Gallery</h3>

          {/* Desktop: infinite scroll carousel */}
          <div className="carousel desktop-carousel">
            <div className="scroll-wrapper" style={{ animationDuration: `${GALLERY_SCROLL_S}s` }}>
              {[0, 1].map(groupIdx => (
                <div key={groupIdx} className="group" aria-hidden={groupIdx === 1 ? 'true' : undefined}>
                  {galleryImages.map((src, i) => (
                    <div key={i} className="card">
                      <img src={src} alt="Gallery image" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Link className="redirect-gallery" to="/gallery"><p>— View More —</p></Link>
          </div>

          {/* Mobile: simple 3-photo swipe carousel */}
          <div
            className="mobile-gallery"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="mobile-gallery-track">
              {mobileSlides.map((src, i) => (
                <img
                  key={src}
                  className={`mobile-gallery-slide${i === mobileSlide ? ' active' : ''}`}
                  src={src}
                  alt="Gallery image"
                />
              ))}
            </div>
            <div className="mobile-gallery-dots">
              {mobileSlides.map((_, i) => (
                <button
                  key={i}
                  className={`dot${i === mobileSlide ? ' active' : ''}`}
                  onClick={() => setMobileSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <Link className="mobile-redirect-gallery" to="/gallery">— View More —</Link>
          </div>
        </section>

        {/* About */}
        <section id="about" className="container about">
          <h3 className="section-title">About</h3>
          <p>
            RiceWerkz was started in April 2025 as a way for retarded car guys to share their experiences and love for cars. With a small group of 6 members, RW aims to share content that deals with
            installments, car meets, races, funny moments, and photoshoots. Cars are meant to be driven, not stored away.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="container contact">
          <h3 className="section-title">Contact</h3>
          <p className="contact-tagline">Dm us on instagram or shoot us an email, if you want to collab or talk anything about cars &lt;3</p>
          <div className="contact-links">
            <a href="https://www.instagram.com/ricewerkz/" target="_blank" rel="noopener noreferrer" className="contact-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              ricewerkz
            </a>
            <a href="mailto:Ricewerkz@gmail.com" className="contact-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
              Ricewerkz@gmail.com
            </a>
            <span className="contact-link contact-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              Based in SoCal
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
