import { useEffect, useRef, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import type { FamilyMemberDraft, FamilyMemberRecord } from '../../data/familyStore'
import avatarIcon from '../../assets/images/home/icons/avatar-default.svg'
import treeFrameImage from '../../assets/images/family/tree-frame.webp'
import scrollKnotImage from '../../assets/images/family/scroll-knot.webp'
import preserveTraditionCalligraphy from '../../assets/images/family/calligraphy-preserve-tradition.png'
import rememberRootsCalligraphy from '../../assets/images/family/calligraphy-remember-roots.png'
import scrollRollerImage from '../../assets/images/family/scroll-roller.webp'
import phoenixDividerImage from '../../assets/images/family/phoenix-divider.png'
import type { Navigate } from '../../types/app'

interface FamilyMemberProps {
  member: FamilyMemberRecord
  highlighted: boolean
}

function FamilyMember({ member, highlighted }: FamilyMemberProps) {
  return (
    <article className={`family-member${highlighted ? ' is-current' : ''}`}>
      <span>{member.role}</span>
      <strong>{member.name}</strong>
      <small>{member.birth_year ? `${member.birth_year} — ${member.death_year ?? 'nay'}` : 'Chưa cập nhật'}</small>
    </article>
  )
}

interface FamilyPageProps {
  members: FamilyMemberRecord[]
  error: string
  onSaveMember: (member: FamilyMemberDraft) => Promise<string>
  onNavigate: Navigate
  onLogout: () => void
}

export default function FamilyPage({ members, error, onSaveMember, onNavigate, onLogout }: FamilyPageProps) {
  const familyName = 'Đoàn'
  const familyTitle = `Gia phả nhà họ ${familyName}`.toLocaleUpperCase('vi')
  const familyTitleSize = Math.max(18, Math.min(30, 920 / familyTitle.length))
  const [scale, setScale] = useState(() => window.innerWidth / 1672)
  const [tab, setTab] = useState<'tree' | 'members'>('tree')
  const [query, setQuery] = useState('')
  const [generation, setGeneration] = useState('all')
  const [treeOpen, setTreeOpen] = useState(false)
  const treeTimer = useRef(0)
  const [selectedId, setSelectedId] = useState('')
  const [draft, setDraft] = useState<FamilyMemberDraft | null>(null)
  const [foodText, setFoodText] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const allMembers = members
  const visibleMembers = allMembers.filter((member) => (generation === 'all' || member.generation === Number(generation)) && member.name.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')))
  const selectedMember = visibleMembers.find((member) => member.id === selectedId) ?? visibleMembers[0]
  const familyGenerations = Array.from({ length: Math.max(0, ...members.map((member) => member.generation)) }, (_, index) => ({ label: `ĐỜI THỨ ${index + 1}`, members: members.filter((member) => member.generation === index + 1) })).filter((item) => item.members.length)
  const memberName = (id: string | null) => members.find((member) => member.id === id)?.name ?? 'Chưa cập nhật'
  const openEditor = (member?: FamilyMemberRecord) => {
    setFormError('')
    setFoodText(member?.favorite_foods.join(', ') ?? '')
    setDraft(member ? { ...member } : { name: '', role: 'Thành viên', generation: 1, birth_year: null, death_year: null, southern_rank: null, father_id: null, mother_id: null, spouse_id: null, lunar_day: null, lunar_month: null, default_worship_time: '10:00', favorite_foods: [] })
  }
  const setField = <K extends keyof FamilyMemberDraft>(key: K, value: FamilyMemberDraft[K]) => setDraft((current) => current ? { ...current, [key]: value } : null)
  const saveEditor = async () => {
    if (!draft) return
    setSaving(true)
    setFormError('')
    try { const id = await onSaveMember({ ...draft, favorite_foods: foodText.split(',').map((food) => food.trim()).filter(Boolean) }); setSelectedId(id); setTab('members'); setDraft(null) }
    catch (cause) { setFormError(cause instanceof Error ? cause.message : 'Không lưu được hồ sơ.') }
    finally { setSaving(false) }
  }
  const revealTree = () => {
    window.clearTimeout(treeTimer.current)
    setTreeOpen(false)
    treeTimer.current = window.setTimeout(() => setTreeOpen(true), 240)
  }

  useEffect(() => {
    document.documentElement.classList.add('home-is-open')
    window.scrollTo(0, 0)
    const updateScale = () => setScale(window.innerWidth / 1672)
    window.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      window.clearTimeout(treeTimer.current)
      document.documentElement.classList.remove('home-is-open')
    }
  }, [])

  useEffect(() => {
    if (tab !== 'tree') {
      window.clearTimeout(treeTimer.current)
      setTreeOpen(false)
      return undefined
    }
    revealTree()
    return () => window.clearTimeout(treeTimer.current)
  }, [tab])

  return (
    <div className="family-page">
      <div className="family-stage" style={{ width: 1672 * scale, height: 1109 * scale }}>
        <div className="family-canvas" style={{ transform: `scale(${scale})` }}>
          <AppHeader active="family" onNavigate={(next) => next === 'family' ? revealTree() : onNavigate(next)} onLogout={onLogout} />
          <div className="family-toolbar">
            <h1>Nhà họ {familyName}</h1><span />
            <div className="family-tabs" role="tablist">
              <button className={tab === 'tree' ? 'is-active' : ''} type="button" role="tab" aria-selected={tab === 'tree'} onClick={() => tab === 'tree' ? revealTree() : setTab('tree')}>Gia phả</button>
              <button className={tab === 'members' ? 'is-active' : ''} type="button" role="tab" aria-selected={tab === 'members'} onClick={() => setTab('members')}>Thành viên</button>
            </div>
            {tab === 'tree' && <div className="family-toolbar__actions"><button type="button">⛶&nbsp; Vừa khung</button><button type="button" onClick={() => window.print()}>▣&nbsp; In phả đồ</button></div>}
          </div>

          <main className="family-content">
            {error && <p className="family-load-error" role="alert">{error}</p>}
            {tab === 'tree' ? <section className={`family-scroll${treeOpen ? ' is-open' : ''}`} aria-label="Gia phả nhà họ Đoàn">
              <div className="family-scroll__sheet">
                <div className="family-scroll__paper">
                  <img className="family-scroll__backdrop" src={treeFrameImage} alt="" />
                  <svg className="family-banner-copy" viewBox="0 0 760 145" role="img" aria-label={familyTitle}>
                    <defs>
                      <path id="family-title-curve" d="M 55 80 Q 380 24 705 80" />
                    </defs>
                    <text className="family-banner-copy__title" textAnchor="middle" style={{ fontSize: familyTitleSize }}><textPath href="#family-title-curve" startOffset="50%" textAnchor="middle">{familyTitle}</textPath></text>
                  </svg>
                  <img className="family-calligraphy family-calligraphy--left" src={preserveTraditionCalligraphy} alt="Giữ nếp nhà" />
                  <img className="family-calligraphy family-calligraphy--right" src={rememberRootsCalligraphy} alt="Nhớ cội nguồn" />
                  <div className="family-tree">
                    {familyGenerations.map((item, index) => (
                      <div className={`family-generation family-generation--${index + 1}`} key={item.label}>
                        <p>{item.label}</p>
                        <div>{item.members.map((member) => <FamilyMember member={member} highlighted={member.id === selectedId} key={member.id} />)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <img className="family-scroll__roller family-scroll__roller--left" src={scrollRollerImage} alt="" />
              <img className="family-scroll__roller family-scroll__roller--right" src={scrollRollerImage} alt="" />
              <img className="family-scroll__tie" src={scrollKnotImage} alt="" />
            </section> : <section className="family-members" aria-labelledby="family-members-title">
              <header className="family-members__heading">
                <div><h2 id="family-members-title">Thành viên gia phả</h2><p>Danh sách các thành viên trong gia phả để tra cứu và quản lý hồ sơ đầy đủ.</p></div>
                <img src={phoenixDividerImage} alt="" />
              </header>
              <div className="family-members__filters">
                <label><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên" /></label>
                <select value={generation} onChange={(event) => setGeneration(event.target.value)} aria-label="Lọc theo đời"><option value="all">Tất cả các đời</option>{familyGenerations.map((item) => <option value={item.members[0].generation} key={item.label}>Đời thứ {item.members[0].generation}</option>)}</select>
                <button type="button" onClick={() => openEditor()}>＋ Thêm người</button>
              </div>
              <div className="family-members__layout">
                <div className="family-member-table">
                  <div className="family-member-table__head"><strong>Họ và tên</strong><strong>Đời</strong><strong>Cha mẹ</strong></div>
                  {visibleMembers.map((member) => <button className={selectedMember?.id === member.id ? 'is-selected' : ''} type="button" key={member.id} onClick={() => setSelectedId(member.id)}><span className="family-avatar"><img src={avatarIcon} alt="" /></span><strong>{member.name}</strong><span>{member.generation}</span><span>{[memberName(member.father_id), memberName(member.mother_id)].filter((name) => name !== 'Chưa cập nhật').join(', ') || '—'}</span></button>)}
                  {!visibleMembers.length && <p className="family-member-table__empty">Không tìm thấy thành viên phù hợp.</p>}
                </div>
                {selectedMember && <aside className="family-profile">
                  <h3>Hồ sơ gia phả</h3>
                  <div className="family-profile__person"><span className="family-avatar family-avatar--large"><img src={avatarIcon} alt="" /></span><div><strong>{selectedMember.name}</strong><small>Đời {selectedMember.generation}</small></div></div>
                  <dl><div><dt>Cha mẹ</dt><dd>{[memberName(selectedMember.father_id), memberName(selectedMember.mother_id)].filter((name) => name !== 'Chưa cập nhật').join(', ') || 'Chưa cập nhật'}</dd></div><div><dt>Hôn phối</dt><dd>{memberName(selectedMember.spouse_id)}</dd></div><div><dt>Thứ bậc</dt><dd>{selectedMember.southern_rank || 'Chưa cập nhật'}</dd></div><div><dt>Năm sinh/mất</dt><dd>{selectedMember.birth_year ?? '—'} / {selectedMember.death_year ?? '—'}</dd></div>{selectedMember.death_year && <><div><dt>Ngày giỗ âm</dt><dd>{selectedMember.lunar_day && selectedMember.lunar_month ? `${selectedMember.lunar_day}/${selectedMember.lunar_month}` : 'Chưa cập nhật'}</dd></div><div><dt>Giờ cúng</dt><dd>{selectedMember.default_worship_time?.slice(0, 5) ?? '10:00'}</dd></div></>}<div><dt>Món yêu thích</dt><dd>{selectedMember.favorite_foods.join(', ') || 'Chưa cập nhật'}</dd></div></dl>
                  <div className="family-profile__actions"><button type="button" onClick={() => openEditor(selectedMember)}>✎&nbsp; Chỉnh sửa hồ sơ</button><button type="button" onClick={() => setTab('tree')}>⌘&nbsp; Xem trên phả đồ</button></div>
                </aside>}
              </div>
            </section>}
          </main>
          {draft && <div className="family-editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setDraft(null)}>
            <form className="family-editor" onSubmit={(event) => { event.preventDefault(); void saveEditor() }}>
              <h2>{draft.id ? 'Chỉnh sửa hồ sơ' : 'Thêm thành viên'}</h2>
              <div className="family-editor__fields">
                <label>Họ và tên<input value={draft.name} onChange={(event) => setField('name', event.target.value)} maxLength={120} required /></label>
                <label>Vai trò<input value={draft.role} onChange={(event) => setField('role', event.target.value)} maxLength={80} required /></label>
                <label>Đời thứ<input type="number" min="1" max="20" value={draft.generation} onChange={(event) => setField('generation', Number(event.target.value))} required /></label>
                <label>Thứ bậc Nam Bộ<select value={draft.southern_rank ?? ''} onChange={(event) => setField('southern_rank', event.target.value || null)}><option value="">Chưa cập nhật</option>{['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Út'].map((rank) => <option key={rank}>{rank}</option>)}</select></label>
                <label>Năm sinh<input type="number" min="1800" max="2100" value={draft.birth_year ?? ''} onChange={(event) => setField('birth_year', event.target.value ? Number(event.target.value) : null)} /></label>
                <label>Năm mất<input type="number" min="1800" max="2100" value={draft.death_year ?? ''} onChange={(event) => setField('death_year', event.target.value ? Number(event.target.value) : null)} /></label>
                <label>Cha<select value={draft.father_id ?? ''} onChange={(event) => setField('father_id', event.target.value || null)}><option value="">Chưa cập nhật</option>{members.filter((item) => item.id !== draft.id).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
                <label>Mẹ<select value={draft.mother_id ?? ''} onChange={(event) => setField('mother_id', event.target.value || null)}><option value="">Chưa cập nhật</option>{members.filter((item) => item.id !== draft.id).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
                <label>Vợ/chồng<select value={draft.spouse_id ?? ''} onChange={(event) => setField('spouse_id', event.target.value || null)}><option value="">Chưa cập nhật</option>{members.filter((item) => item.id !== draft.id).map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
                <label>Món ăn yêu thích<input value={foodText} onChange={(event) => setFoodText(event.target.value)} placeholder="Bánh tét, chè trôi nước" /></label>
                {draft.death_year !== null && <><label>Ngày giỗ âm<input type="number" min="1" max="30" value={draft.lunar_day ?? ''} onChange={(event) => setField('lunar_day', event.target.value ? Number(event.target.value) : null)} /></label><label>Tháng giỗ âm<input type="number" min="1" max="12" value={draft.lunar_month ?? ''} onChange={(event) => setField('lunar_month', event.target.value ? Number(event.target.value) : null)} /></label><label>Giờ cúng mặc định<input type="time" value={draft.default_worship_time?.slice(0, 5) ?? '10:00'} onChange={(event) => setField('default_worship_time', event.target.value)} /></label></>}
              </div>
              {formError && <p role="alert">{formError}</p>}
              <div className="family-editor__actions"><button type="button" onClick={() => setDraft(null)}>Hủy</button><button type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu hồ sơ'}</button></div>
            </form>
          </div>}
        </div>
      </div>
    </div>
  )
}

