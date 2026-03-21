import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Manage.css'

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY
const uid = () => `_new_${Math.random().toString(36).slice(2)}`

export default function ManagePage() {
  const { memberId } = useParams()
  const [searchParams] = useSearchParams()
  const key = searchParams.get('key')

  const [member, setMember] = useState(null)
  const [specs, setSpecs] = useState([])
  const [mods, setMods] = useState([])
  const [deletedSpecIds, setDeletedSpecIds] = useState([])
  const [deletedModIds, setDeletedModIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeMember, setActiveMember] = useState(memberId)
  const [allMembers, setAllMembers] = useState([])

  const isAdmin = key === ADMIN_KEY

  useEffect(() => {
    async function fetchData() {
      const { data: memberData, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', activeMember)
        .single()

      if (error || !memberData) { setDenied(true); setLoading(false); return }

      const authorized = isAdmin || key === memberData.access_key
      if (!authorized) { setDenied(true); setLoading(false); return }

      const { data: specsData } = await supabase
        .from('member_specs')
        .select('*')
        .eq('member_id', activeMember)
        .order('sort_order')

      const { data: modsData } = await supabase
        .from('member_mods')
        .select('*')
        .eq('member_id', activeMember)
        .order('sort_order')

      if (isAdmin && allMembers.length === 0) {
        const { data: membersData } = await supabase
          .from('members')
          .select('id, name')
          .eq('has_detail_page', true)
          .order('name')
        setAllMembers(membersData || [])
      }

      setMember(memberData)
      setSpecs(specsData || [])
      setMods(modsData || [])
      setDeletedSpecIds([])
      setDeletedModIds([])
      setLoading(false)
    }

    fetchData()
  }, [activeMember])

  // ── Specs ──────────────────────────────────────────────

  const updateSpec = (localId, field, value) =>
    setSpecs(prev => prev.map(s => (s.id ?? s._localId) === localId ? { ...s, [field]: value } : s))

  const addSpec = () =>
    setSpecs(prev => [...prev, { _localId: uid(), label: '', value: '', sort_order: prev.length }])

  const deleteSpec = (localId) => {
    const spec = specs.find(s => (s.id ?? s._localId) === localId)
    if (spec?.id) setDeletedSpecIds(prev => [...prev, spec.id])
    setSpecs(prev => prev.filter(s => (s.id ?? s._localId) !== localId))
  }

  // ── Mods ───────────────────────────────────────────────

  const updateModItem = (localId, itemIndex, value) =>
    setMods(prev => prev.map(m =>
      (m.id ?? m._localId) === localId
        ? { ...m, items: m.items.map((it, i) => i === itemIndex ? value : it) }
        : m
    ))

  const addModItem = (localId) =>
    setMods(prev => prev.map(m =>
      (m.id ?? m._localId) === localId ? { ...m, items: [...m.items, ''] } : m
    ))

  const deleteModItem = (localId, itemIndex) =>
    setMods(prev => prev.map(m =>
      (m.id ?? m._localId) === localId
        ? { ...m, items: m.items.filter((_, i) => i !== itemIndex) }
        : m
    ))

  const updateModCategory = (localId, value) =>
    setMods(prev => prev.map(m => (m.id ?? m._localId) === localId ? { ...m, category: value } : m))

  const addModCategory = () =>
    setMods(prev => [...prev, { _localId: uid(), category: '', items: [], sort_order: prev.length }])

  const deleteModCategory = (localId) => {
    const mod = mods.find(m => (m.id ?? m._localId) === localId)
    if (mod?.id) setDeletedModIds(prev => [...prev, mod.id])
    setMods(prev => prev.filter(m => (m.id ?? m._localId) !== localId))
  }

  // ── Save ───────────────────────────────────────────────

  const handleSave = async () => {
    const emptySpecValue = specs.some(s => s.value.trim() === '')
    const emptyModItem = mods.some(m => m.items.some(it => it.trim() === ''))
    const emptyCategory = isAdmin && mods.some(m => m.category.trim() === '')

    if (emptySpecValue || emptyModItem || emptyCategory) {
      setSaveStatus('Fill in all empty fields before saving.')
      return
    }

    setSaving(true)
    setSaveStatus('')

    if (deletedSpecIds.length)
      await supabase.from('member_specs').delete().in('id', deletedSpecIds)
    if (deletedModIds.length)
      await supabase.from('member_mods').delete().in('id', deletedModIds)

    for (const spec of specs) {
      if (spec.id) {
        await supabase.from('member_specs')
          .update({ label: spec.label, value: spec.value })
          .eq('id', spec.id)
      } else {
        await supabase.from('member_specs')
          .insert({ member_id: activeMember, label: spec.label, value: spec.value, sort_order: spec.sort_order })
      }
    }

    for (const mod of mods) {
      if (mod.id) {
        await supabase.from('member_mods')
          .update({ category: mod.category, items: mod.items })
          .eq('id', mod.id)
      } else {
        await supabase.from('member_mods')
          .insert({ member_id: activeMember, category: mod.category, items: mod.items, sort_order: mod.sort_order })
      }
    }

    setDeletedSpecIds([])
    setDeletedModIds([])
    setSaving(false)
    setSaveStatus('Saved ✓')
    setTimeout(() => setSaveStatus(''), 2500)
  }

  if (loading) return <div className="page-loading">Loading...</div>
  if (denied) return <Navigate to="/" replace />

  return (
    <>
      <Header brand={{ type: 'text', text: `Manage — ${member.name}` }} />
      <main className="manage-page container">

        {isAdmin && (
          <div className="manage-member-switcher">
            <label>Editing:</label>
            <select value={activeMember} onChange={e => { setActiveMember(e.target.value); setLoading(true) }}>
              {allMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        )}

        {/* Specs */}
        <section className="manage-section">
          <div className="manage-section-header">
            <h2>Specs</h2>
            {isAdmin && <button className="manage-btn-add" onClick={addSpec}>+ Add Spec</button>}
          </div>
          <div className="manage-specs">
            {specs.map(spec => {
              const localId = spec.id ?? spec._localId
              return (
                <div key={localId} className="manage-spec-row">
                  {isAdmin
                    ? <input value={spec.label} onChange={e => updateSpec(localId, 'label', e.target.value)} placeholder="Label" />
                    : <span className="manage-spec-label">{spec.label}</span>
                  }
                  <input
                    value={spec.value}
                    onChange={e => updateSpec(localId, 'value', e.target.value)}
                    placeholder="Value"
                    className={spec.value.trim() === '' ? 'input-error' : ''}
                  />
                  {isAdmin && <button className="manage-btn-delete" onClick={() => deleteSpec(localId)}>✕</button>}
                </div>
              )
            })}
          </div>
        </section>

        {/* Mods */}
        <section className="manage-section">
          <div className="manage-section-header">
            <h2>Mods</h2>
            {isAdmin && <button className="manage-btn-add" onClick={addModCategory}>+ Add Category</button>}
          </div>
          {mods.map(mod => {
            const localId = mod.id ?? mod._localId
            return (
              <div key={localId} className="manage-mod-category">
                <div className="manage-mod-category-header">
                  {isAdmin
                    ? <input
                        className={`manage-category-name${mod.category.trim() === '' ? ' input-error' : ''}`}
                        value={mod.category}
                        onChange={e => updateModCategory(localId, e.target.value)}
                        placeholder="Category name"
                      />
                    : <span className="manage-category-name-static">{mod.category}</span>
                  }
                  {isAdmin && <button className="manage-btn-delete" onClick={() => deleteModCategory(localId)}>✕</button>}
                </div>
                <ul className="manage-mod-items">
                  {mod.items.map((item, i) => (
                    <li key={i}>
                      <input
                        value={item}
                        onChange={e => updateModItem(localId, i, e.target.value)}
                        placeholder="Mod item"
                        className={item.trim() === '' ? 'input-error' : ''}
                      />
                      <button className="manage-btn-delete" onClick={() => deleteModItem(localId, i)}>✕</button>
                    </li>
                  ))}
                </ul>
                <button className="manage-btn-add-item" onClick={() => addModItem(localId)}>+ Add Item</button>
              </div>
            )
          })}
        </section>

        {/* Save */}
        <div className="manage-save-bar">
          {saveStatus && <span className={saveStatus.includes('Fill') ? 'status-error' : 'status-ok'}>{saveStatus}</span>}
          <button className="manage-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </main>
      <Footer />
    </>
  )
}
