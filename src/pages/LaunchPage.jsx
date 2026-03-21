import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LaunchPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const memberId = localStorage.getItem('rw_member_id')
    const key = localStorage.getItem('rw_key')

    if (memberId && key) {
      navigate(`/hub/${memberId}?key=${key}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return <div className="page-loading">Loading...</div>
}
