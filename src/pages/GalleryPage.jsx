import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Gallery.css'

const CLOUD_NAME  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const GALLERY_TAG = import.meta.env.VITE_CLOUDINARY_GALLERY_TAG
const PAGE_SIZE   = 24

async function fetchPhotos(tag) {
  try {
    const res  = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`)
    const data = await res.json()
    if (!data.resources?.length) return []
    return data.resources
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(r => ({
        thumb: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,f_auto,q_auto/${r.public_id}`,
        full:  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${r.public_id}`,
      }))
  } catch {
    return []
  }
}

export default function GalleryPage() {
  const [photos, setPhotos]     = useState([])
  const [visible, setVisible]   = useState(PAGE_SIZE)
  const [loading, setLoading]   = useState(true)
  const [modalIdx, setModalIdx] = useState(null)

  useEffect(() => {
    fetchPhotos(GALLERY_TAG)
      .then(items => setPhotos(items))
      .finally(() => setLoading(false))
  }, [])

  const shown   = photos.slice(0, visible)
  const hasMore = visible < photos.length

  const closeModal = () => setModalIdx(null)

  useEffect(() => {
    if (modalIdx === null) return
    function onKey(e) { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalIdx])

  return (
    <>
      <Header brand={{ type: 'logo' }} />
      <main>
        <section className="container gallery-page">
          <h3 className="section-title">RiceWerkz Gallery</h3>

          {loading && <p className="gallery-status">Loading…</p>}
          {!loading && photos.length === 0 && <p className="gallery-status">No photos yet.</p>}

          {shown.length > 0 && (
            <div className="masonry">
              {shown.map((item, i) => (
                <div key={item.thumb} className="masonry-item">
                  <img
                    src={item.thumb}
                    alt="Gallery photo"
                    loading="lazy"
                    className="gallery-media"
                    onClick={() => setModalIdx(i)}
                  />
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="gallery-more">
              <button className="gallery-more-btn" onClick={() => setVisible(v => v + PAGE_SIZE)}>
                View More
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />

      {modalIdx !== null && (
        <div className="gallery-modal" onClick={closeModal}>
          <button className="gallery-modal-close" onClick={closeModal} aria-label="Close">✕</button>
          <img
            src={shown[modalIdx].full}
            alt="Gallery photo"
            className="gallery-modal-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
