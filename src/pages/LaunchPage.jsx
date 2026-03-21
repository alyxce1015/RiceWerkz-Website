import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LaunchPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const cookies = Object.fromEntries(
      document.cookie.split('; ').filter(Boolean).map(c => c.split('='))
    )
    const memberId = cookies['rw_member_id']
    const key = cookies['rw_key']

    if (memberId && key) {
      navigate(`/hub/${memberId}?key=${key}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return <div className="page-loading">Loading...</div>
}
