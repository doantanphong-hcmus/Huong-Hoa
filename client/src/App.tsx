import './App.css'
import { useState } from 'react'
import { AncestorFormModal } from './components/AncestorFormModal'
import { getPortraitSrc } from './data/portraits'
import { useAncestors } from './store/ancestorStore'
import type { Ancestor } from './types/ancestor'
import { formatIso, formatLunar } from './utils/lunar' 

function App() {
  const ancestors = useAncestors()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Ancestor | null>(null)
 
  const openCreate = () => { setEditing(null); setOpen(true) }
  const openEdit = (a: Ancestor) => { setEditing(a); setOpen(true) }
 
  return (
    <main style={{ maxWidth: 760, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Hồ sơ tổ tiên</h1>
      <button onClick={openCreate}>+ Thêm hồ sơ</button>
 
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem' }}>
        {ancestors.map((a) => (
          <li key={a.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img src={getPortraitSrc(a.portraitId)} alt="" width={56} height={56} style={{ borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <strong>{a.fullName}</strong>
              <div>Sinh: {formatLunar(a.birthLunar)} ({formatIso(a.birthSolar)})</div>
              <div>Mất: {formatLunar(a.deathLunar)} ({formatIso(a.deathSolar)})</div>
            </div>
            <button onClick={() => openEdit(a)}>Sửa</button>
          </li>
        ))}
      </ul>
 
      <AncestorFormModal open={open} ancestor={editing} onClose={() => setOpen(false)} />
    </main>
  )
}
 
export default App