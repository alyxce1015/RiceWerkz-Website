import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Hub.css'

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

export default function HubPage() {
  const { memberId } = useParams()
  const [searchParams] = useSearchParams()
  const key = searchParams.get('key')
  const navigate = useNavigate()

  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)

  const isAdmin = key === ADMIN_KEY

  useEffect(() => {
    async function fetchMember() {
      const { data, error } = await supabase
        .from('members')
        .select('id, name, access_key')
        .eq('id', memberId)
        .single()

      if (error || !data) { setDenied(true); setLoading(false); return }

      const authorized = isAdmin || key === data.access_key
      if (!authorized) { setDenied(true); setLoading(false); return }

      const maxAge = 60 * 60 * 24 * 365 // 1 year
      document.cookie = `rw_member_id=${memberId}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `rw_key=${key}; path=/; max-age=${maxAge}; SameSite=Lax`

      setMember(data)
      setLoading(false)
    }

    fetchMember()
  }, [memberId])

  if (loading) return <div className="page-loading">Loading...</div>
  if (denied) return <Navigate to="/" replace />

  return (
    <>
      <Header brand={{ type: 'text', text: member.name }} />
      <main className="hub-page container">
        <p className="hub-greeting">Wassup {member.name}, What are we doing today?</p>
        <div className="hub-options">
          <button
            className="hub-option"
            onClick={() => navigate(`/upload?key=${key}&member=${memberId}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>Upload Photos</span>
          </button>
          <button
            className="hub-option"
            onClick={() => navigate(`/manage/${memberId}?key=${key}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span>Edit Vehicle Attributes</span>
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}
