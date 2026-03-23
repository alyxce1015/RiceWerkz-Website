import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Gallery.css'

const CLOUD_NAME  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const GALLERY_TAG = import.meta.env.VITE_CLOUDINARY_GALLERY_TAG
const PAGE_SIZE   = 24

const VIDEO_FORMATS = new Set(['mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v', 'ogv', 'wmv', 'flv', '3gp'])

async function fetchAllMedia(tag) {
  const [imageRes, videoRes] = await Promise.allSettled([
    fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`).then(r => r.json()),
    fetch(`https://res.cloudinary.com/${CLOUD_NAME}/video/list/${tag}.json`).then(r => r.json()),
  ])

  const images = (imageRes.status === 'fulfilled' && imageRes.value?.resources)
    ? imageRes.value.resources
        .filter(r => !VIDEO_FORMATS.has((r.format || '').toLowerCase()))
        .map(r => ({ ...r, mediaType: 'image' }))
    : []

  const videos = (videoRes.status === 'fulfilled' && videoRes.value?.resources)
    ? videoRes.value.resources.map(r => ({ ...r, mediaType: 'video' }))
    : []

  return [...images, ...videos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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

function GalleryVideo({ src, poster }) {
  const videoRef = useRef(null)

  function handlePlay() {
    document.querySelectorAll('video.gallery-media').forEach(v => {
      if (v !== videoRef.current && !v.paused) v.pause()
    })
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className="gallery-media"
      controls
      preload="none"
      playsInline
      onPlay={handlePlay}
    />
  )
}

export default function GalleryPage() {
  const [allMedia, setAllMedia] = useState([])
  const [visible, setVisible]   = useState(PAGE_SIZE)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetchAllMedia(GALLERY_TAG)
      .then(items => setAllMedia(items))
      .finally(() => setLoading(false))
  }, [])

  const shown  = allMedia.slice(0, visible)
  const hasMore = visible < allMedia.length

  return (
    <>
      <Header brand={{ type: 'logo' }} />
      <main>
        <section className="container gallery-page">
          <h3 className="section-title">Gallery</h3>

          {loading && <p className="gallery-status">Loading…</p>}
          {!loading && allMedia.length === 0 && <p className="gallery-status">No media yet.</p>}

          {shown.length > 0 && (
            <div className="masonry">
              {shown.map(item => (
                <div key={item.public_id} className="masonry-item">
                  {item.mediaType === 'image' ? (
                    <GalleryImage
                      src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.public_id}`}
                    />
                  ) : (
                    <GalleryVideo
                      src={`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${item.public_id}`}
                      poster={`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/so_0/${item.public_id}.jpg`}
                    />
                  )}
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
