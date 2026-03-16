import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { coreMembers } from '../data/members'

const heroSlides = [
  '/assets/images/RW.jpg',
  '/assets/images/WRX_Cinematic.PNG',
  '/assets/images/WRX_roller.PNG',
]

const galleryImages = [
  '/assets/images/WRX_Cinematic.PNG',
  '/assets/images/WRX_roller.PNG',
  '/assets/images/fillerPhoto.png',
  '/assets/images/fillerPhoto.png',
  '/assets/images/fillerPhoto.png',
  '/assets/images/fillerPhoto.png',
  '/assets/images/fillerPhoto.png',
  '/assets/images/RW 1.PNG',
  '/assets/images/fillerPhoto.png',
]

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0)
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced) return
    const timer = setInterval(() => {
      setActiveSlide(i => (i + 1) % heroSlides.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [prefersReduced])

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
          <div className="carousel">
            {[0, 1].map(groupIdx => (
              <div key={groupIdx} className="group" aria-hidden={groupIdx === 1}>
                {galleryImages.map((src, i) => (
                  <div key={i} className="card">
                    <img src={src} alt="Gallery image" />
                  </div>
                ))}
              </div>
            ))}
            <Link className="redirect-gallery" to="/gallery"><p>— View More —</p></Link>
          </div>
        </section>

        {/* About */}
        <section id="about" className="container about">
          <h3 className="section-title">About</h3>
          <p>
            RiceWerkz was started in April 2024 as a way for retarded car guys to share their experiences and love for cars. With a small group of 6 members, RW aims to share content with its viewers that deal with
            installs, car meets, funny moments, and photos. This website aims to showcase the members cars and what they have done to them, showing what RiceWerkz is all about.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="container contact">
          <h3 className="section-title">Contact</h3>
          <p>Interested? Drop your details and we'll get back to you.</p>
          <form className="contact-form" action="#" method="post">
            <label>
              Name
              <input type="text" name="name" placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="you@example.com" />
            </label>
            <label>
              Message
              <textarea name="message" rows="4" placeholder="I want to learn more..." />
            </label>
            <button className="btn primary" type="submit">Send</button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  )
}
