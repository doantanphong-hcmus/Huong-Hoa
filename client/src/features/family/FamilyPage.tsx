import { useEffect, useRef, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import { familyGenerations } from '../../data/family'
import avatarIcon from '../../assets/images/home/icons/avatar-default.svg'
import treeFrameImage from '../../assets/images/family/tree-frame.webp'
import scrollKnotImage from '../../assets/images/family/scroll-knot.webp'
import preserveTraditionCalligraphy from '../../assets/images/family/calligraphy-preserve-tradition.png'
import rememberRootsCalligraphy from '../../assets/images/family/calligraphy-remember-roots.png'
import scrollRollerImage from '../../assets/images/family/scroll-roller.webp'
import phoenixDividerImage from '../../assets/images/family/phoenix-divider.png'
import type { FamilyMemberData, Navigate } from '../../types/app'

interface FamilyMemberProps {
  member: FamilyMemberData
  highlighted: boolean
}

function FamilyMember({ member, highlighted }: FamilyMemberProps) {
  return (
    <article className={`family-member${highlighted ? ' is-current' : ''}`}>
      <span>{member.role}</span>
      <strong>{member.name}</strong>
      <small>{member.years}</small>
    </article>
  )
}

interface FamilyPageProps {
  onNavigate: Navigate
  onLogout: () => void
}

export default function FamilyPage({ onNavigate, onLogout }: FamilyPageProps) {
  const familyName = 'Đoàn'
  const familyTitle = `Gia phả nhà họ ${familyName}`.toLocaleUpperCase('vi')
  const familyTitleSize = Math.max(18, Math.min(30, 920 / familyTitle.length))
  const [scale, setScale] = useState(() => window.innerWidth / 1672)
  const [tab, setTab] = useState<'tree' | 'members'>('tree')
  const [query, setQuery] = useState('')
  const [generation, setGeneration] = useState('all')
  const [treeOpen, setTreeOpen] = useState(false)
  const treeTimer = useRef(0)
  const allMembers = familyGenerations.flatMap((item, index) => item.members.map((member) => ({ ...member, generation: index + 1 })))
  const visibleMembers = allMembers.filter((member) => (generation === 'all' || member.generation === Number(generation)) && member.name.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')))
  const [selectedId, setSelectedId] = useState(() => allMembers.find((member) => member.current)?.id ?? allMembers[0].id)
  const selectedMember = allMembers.find((member) => member.id === selectedId) ?? visibleMembers[0] ?? allMembers[0]
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
                <select value={generation} onChange={(event) => setGeneration(event.target.value)} aria-label="Lọc theo đời"><option value="all">Tất cả các đời</option>{familyGenerations.map((_, index) => <option value={index + 1} key={index}>Đời thứ {index + 1}</option>)}</select>
                <button type="button">＋ Thêm người</button>
              </div>
              <div className="family-members__layout">
                <div className="family-member-table">
                  <div className="family-member-table__head"><strong>Họ và tên</strong><strong>Đời</strong><strong>Cha mẹ</strong></div>
                  {visibleMembers.map((member) => <button className={selectedMember.id === member.id ? 'is-selected' : ''} type="button" key={member.id} onClick={() => setSelectedId(member.id)}><span className="family-avatar"><img src={avatarIcon} alt="" /></span><strong>{member.name}</strong><span>{member.generation}</span><span>{member.parents || '—'}</span></button>)}
                  {!visibleMembers.length && <p className="family-member-table__empty">Không tìm thấy thành viên phù hợp.</p>}
                </div>
                <aside className="family-profile">
                  <h3>Hồ sơ gia phả</h3>
                  <div className="family-profile__person"><span className="family-avatar family-avatar--large"><img src={avatarIcon} alt="" /></span><div><strong>{selectedMember.name}</strong><small>Đời {selectedMember.generation}</small></div></div>
                  <dl><div><dt>Cha mẹ</dt><dd>{selectedMember.parents || 'Chưa cập nhật'}</dd></div><div><dt>Hôn phối</dt><dd>{selectedMember.partner || 'Chưa cập nhật'}</dd></div><div><dt>Thông tin</dt><dd>{selectedMember.years}</dd></div></dl>
                  <div className="family-profile__actions"><button type="button">✎&nbsp; Chỉnh sửa hồ sơ</button><button type="button" onClick={() => setTab('tree')}>⌘&nbsp; Xem trên phả đồ</button></div>
                </aside>
              </div>
            </section>}
          </main>
        </div>
      </div>
    </div>
  )
}

