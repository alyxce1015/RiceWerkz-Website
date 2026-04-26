import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Upload.css'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const PRESETS = {
  hero:    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_HERO,
  gallery: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_GALLERY,
}

export default function UploadPage() {
  const [searchParams] = useSearchParams()
  const memberParam = searchParams.get('member')
  const keyParam    = searchParams.get('key')
  const hubUrl      = memberParam && keyParam ? `/hub/${memberParam}?key=${keyParam}` : null

  const [destination, setDestination] = useState(null)
  const [files, setFiles]             = useState([])
  const [stage, setStage]             = useState('idle')
  const [dragOver, setDragOver]       = useState(false)
  const inputRef = useRef(null)

  function handleFiles(selected) {
    const items = Array.from(selected).map(file => ({
      file,
      progress: 0,
      status: 'pending',
    }))
    setFiles(prev => [...prev, ...items])
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  async function uploadAll() {
    if (!destination || files.length === 0) return
    setStage('uploading')
    await Promise.all(files.map((item, idx) => uploadOne(item.file, idx)))
    setStage('done')
  }

  function uploadOne(file, idx) {
    return new Promise(resolve => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', PRESETS[destination])

      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`)

      xhr.upload.onprogress = e => {
        if (!e.lengthComputable) return
        const pct = Math.round((e.loaded / e.total) * 100)
        setFiles(prev => prev.map((f, i) =>
          i === idx ? { ...f, progress: pct, status: 'uploading' } : f
        ))
      }

      xhr.onload = () => {
        const ok = xhr.status >= 200 && xhr.status < 300
        if (!ok) {
          try {
            const err = JSON.parse(xhr.responseText)
            console.error('Cloudinary upload error:', err.error?.message || xhr.responseText)
          } catch { console.error('Cloudinary upload error:', xhr.status, xhr.responseText) }
        }
        setFiles(prev => prev.map((f, i) =>
          i === idx ? { ...f, progress: 100, status: ok ? 'done' : 'error' } : f
        ))
        resolve()
      }

      xhr.onerror = () => {
        setFiles(prev => prev.map((f, i) =>
          i === idx ? { ...f, status: 'error' } : f
        ))
        resolve()
      }

      setFiles(prev => prev.map((f, i) =>
        i === idx ? { ...f, status: 'uploading' } : f
      ))
      xhr.send(formData)
    })
  }

  function reset() {
    setFiles([])
    setDestination(null)
    setStage('idle')
  }

  const canUpload = destination && files.length > 0 && stage === 'idle'

  if (stage === 'done') {
    const doneCount  = files.filter(f => f.status === 'done').length
    const errorCount = files.filter(f => f.status === 'error').length
    return (
      <>
        <Header brand={{ type: 'text', text: 'Upload Photos' }} backTo={hubUrl} />
        <main className="upload-page container">
          <div className="done-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
            <p>
              {doneCount} photo{doneCount !== 1 ? 's' : ''} uploaded to <strong>{destination}</strong>
              {errorCount > 0 && ` · ${errorCount} failed`}
            </p>
            <button className="upload-btn" onClick={reset}>Upload More</button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header brand={{ type: 'text', text: 'Upload Photos' }} backTo={hubUrl} />
      <main className="upload-page container">

        <div className="destination-grid">
          <button
            className={`dest-btn${destination === 'hero' ? ' selected' : ''}`}
            onClick={() => setDestination('hero')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Title
          </button>
          <button
            className={`dest-btn${destination === 'gallery' ? ' selected' : ''}`}
            onClick={() => setDestination('gallery')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="16" height="14" rx="2"/>
              <rect x="6" y="2" width="16" height="14" rx="2"/>
              <circle cx="10.5" cy="9.5" r="1.5"/>
              <polyline points="18 15 14 11 6 19"/>
            </svg>
            Gallery
          </button>
        </div>

        <div
          className={`drop-zone${dragOver ? ' active' : ''}${!destination ? ' disabled' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
          <p>Tap to select photos</p>
          <p className="drop-hint">or drag and drop</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            capture={false}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="file-list">
            {files.map((item, i) => (
              <div key={i} className="file-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="file-item-name">{item.file.name}</span>
                    <span className={`file-item-status ${item.status}`}>
                      {item.status === 'pending'   && 'Waiting'}
                      {item.status === 'uploading' && `${item.progress}%`}
                      {item.status === 'done'      && '✓ Done'}
                      {item.status === 'error'     && '✗ Failed'}
                    </span>
                  </div>
                  {item.status === 'uploading' && (
                    <div className="progress-bar-wrap">
                      <div className="progress-bar" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="upload-btn" onClick={uploadAll} disabled={!canUpload}>
          {stage === 'uploading'
            ? 'Uploading…'
            : `Upload${files.length > 0 ? ` ${files.length} photo${files.length !== 1 ? 's' : ''}` : ''}`
          }
        </button>

        {files.length > 0 && stage === 'idle' && (
          <button className="reset-link" onClick={reset}>Clear</button>
        )}
      </main>
      <Footer />
    </>
  )
}
