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
      .map(r => `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${r.public_id}`)
  } catch {
    return []
  }
}

function GalleryImage({ src }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <img
        src={src}
        alt="Gallery photo"
        loading="lazy"
        className="gallery-media"
        onClick={() => setOpen(true)}
      />
      {open && (
        <div className="gallery-modal" onClick={() => setOpen(false)}>
          <img src={src} alt="Gallery photo" className="gallery-modal-img" onClick={e => e.stopPropagation()} />
          <button className="gallery-modal-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>
      )}
    </>
  )
}

export default function GalleryPage() {
  const [photos, setPhotos]   = useState([])
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotos(GALLERY_TAG)
      .then(items => setPhotos(items))
      .finally(() => setLoading(false))
  }, [])

  const shown   = photos.slice(0, visible)
  const hasMore = visible < photos.length

  return (
    <>
      <Header brand={{ type: 'logo' }} />
      <main>
        <section className="container gallery-page">
          <h3 className="section-title">Gallery</h3>

          {loading && <p className="gallery-status">Loading…</p>}
          {!loading && photos.length === 0 && <p className="gallery-status">No photos yet.</p>}

          {shown.length > 0 && (
            <div className="masonry">
              {shown.map(src => (
                <div key={src} className="masonry-item">
                  <GalleryImage src={src} />
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
    </>
  )
}
