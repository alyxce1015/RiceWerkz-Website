import { useState, useEffect, useCallback } from 'react'
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

  const closeModal = useCallback(() => setModalIdx(null), [])
  const prev = useCallback(() => setModalIdx(i => (i - 1 + shown.length) % shown.length), [shown.length])
  const next = useCallback(() => setModalIdx(i => (i + 1) % shown.length), [shown.length])

  useEffect(() => {
    if (modalIdx === null) return
    function onKey(e) {
      if (e.key === 'Escape')     closeModal()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalIdx, closeModal, prev, next])

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
          <button className="gallery-modal-arrow gallery-modal-prev" onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous">‹</button>
          <img
            src={shown[modalIdx].full}
            alt="Gallery photo"
            className="gallery-modal-img"
            onClick={e => e.stopPropagation()}
          />
          <button className="gallery-modal-arrow gallery-modal-next" onClick={e => { e.stopPropagation(); next() }} aria-label="Next">›</button>
        </div>
      )}
    </>
  )
}
