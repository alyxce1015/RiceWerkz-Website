import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import '../styles/VehicleInfo.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { allMembers } from '../data/members'

function ToggleBox({ category, items }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="togglebox" onClick={() => setOpen(o => !o)}>
      <div className="togglebox__header">
        {category}
        <span className={`togglebox__chev${open ? ' open' : ''}`}>▾</span>
      </div>
      <div className="togglebox__content" style={{ maxHeight: open ? '300px' : '0', marginTop: open ? '12px' : '0' }}>
        <ul>
          {items.filter(Boolean).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
  )
}

export default function VehicleInfoPage() {
  const { memberId } = useParams()
  const member = allMembers.find(m => m.id === memberId)
  const [modalSrc, setModalSrc] = useState(null)

  if (!member) return <Navigate to="/cars" replace />

  return (
    <>
      <Header brand={{ type: 'text', text: member.name }} />
      <main>
        {/* Vehicle Hero */}
        <section id="vehicle" className="vehicle">
          <div className="container vehicle-inner">
            <div className="vehicle-image" aria-hidden="true">
              <img src={member.coverPhoto} alt={member.title} />
            </div>
            <div className="vehicle-info">
              <h2>{member.title}</h2>
              <div className="social-links">
                <a className="social-link" target="_blank" rel="noopener noreferrer" href={member.instagram}>
                  <i className="fa-brands fa-instagram" id="insta" aria-hidden="true" />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Specs */}
        <section id="specs" className="container specs">
          <h3 className="section-title">Specs</h3>
          <div className="spec-grid">
            {member.specs.map(spec => (
              <div key={spec.label} className="spec">
                <h4>{spec.label}</h4>
                <p>{spec.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="container gallery">
          <h3 className="section-title">Gallery</h3>
          <div className="responsive">
            {member.gallery.map((src, i) => (
              <img key={i} src={src} alt={`Gallery ${i + 1}`} onClick={() => setModalSrc(src)} />
            ))}
          </div>

          {modalSrc && (
            <div id="myModal" className="modal" style={{ display: 'block' }} onClick={e => { if (e.target !== e.currentTarget.querySelector('.modal-content')) setModalSrc(null) }}>
              <span className="close" onClick={() => setModalSrc(null)} />
              <img className="modal-content" src={modalSrc} alt="Gallery zoom" />
            </div>
          )}
        </section>

        {/* Mods */}
        <section id="mods" className="container mods">
          <h3 className="section-title">Mods List</h3>
          {member.mods.map(mod => (
            <ToggleBox key={mod.category} category={mod.category} items={mod.items} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}
