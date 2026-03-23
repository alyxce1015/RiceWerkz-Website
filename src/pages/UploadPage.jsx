import { useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import '../styles/Upload.css'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const PRESETS = {
  hero:    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_HERO,
  gallery: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_GALLERY,
}

// status: 'idle' | 'picking' | 'uploading' | 'done'

export default function UploadPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const memberParam = searchParams.get('member')
  const keyParam = searchParams.get('key')
  const hubUrl = memberParam && keyParam ? `/hub/${memberParam}?key=${keyParam}` : null

  const [destination, setDestination] = useState(null)   // 'hero' | 'gallery'
  const [files, setFiles]             = useState([])      // [{ file, progress, status }]
  const [stage, setStage]             = useState('idle')  // 'idle' | 'uploading' | 'done'
  const [dragOver, setDragOver]       = useState(false)
  const inputRef = useRef(null)

  function handleFiles(selected) {
    const items = Array.from(selected).map(file => ({
      file,
      progress: 0,
      status: 'pending', // pending | uploading | done | error
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
      <div className="upload-page">
        <p className="upload-logo">RiceWerkz</p>
        <p className="upload-subtitle">Gallery Upload Tool</p>
        <div className="done-banner">
          <i className="fa-solid fa-circle-check" />
          <p>
            {doneCount} photo{doneCount !== 1 ? 's' : ''} uploaded to <strong>{destination}</strong>
            {errorCount > 0 && ` · ${errorCount} failed`}
          </p>
          <button className="upload-btn" onClick={reset}>Upload More</button>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-page">
      {hubUrl && (
        <button className="upload-back" onClick={() => navigate(hubUrl)} aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back
        </button>
      )}
      <p className="upload-logo">RiceWerkz</p>
      <p className="upload-subtitle">Gallery Upload Tool</p>

      {/* Destination */}
      <div className="destination-grid">
        <button
          className={`dest-btn${destination === 'hero' ? ' selected' : ''}`}
          onClick={() => setDestination('hero')}
        >
          <i className="fa-solid fa-image" />
          Title
        </button>
        <button
          className={`dest-btn${destination === 'gallery' ? ' selected' : ''}`}
          onClick={() => setDestination('gallery')}
        >
          <i className="fa-solid fa-images" />
          Gallery
        </button>
      </div>

      {/* Drop zone */}
      <div
        className={`drop-zone${dragOver ? ' active' : ''}${!destination ? ' disabled' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <i className="fa-solid fa-cloud-arrow-up" />
        <p>Tap to select photos</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>or drag and drop</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          capture={false}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* File list */}
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

      {/* Upload button */}
      <button className="upload-btn" onClick={uploadAll} disabled={!canUpload}>
        {stage === 'uploading'
          ? 'Uploading…'
          : `Upload${files.length > 0 ? ` ${files.length} photo${files.length !== 1 ? 's' : ''}` : ''}`
        }
      </button>

      {files.length > 0 && stage === 'idle' && (
        <button className="reset-link" onClick={reset}>Clear</button>
      )}
    </div>
  )
}
