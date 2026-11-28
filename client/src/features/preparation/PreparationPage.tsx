import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import AppHeader from '../../components/AppHeader'
import { splitByStatus } from '../../data/preparation'
import type { Household, MemorialEvent, MemorialTask, Navigate, UpdateOccasion } from '../../types/app'

type ModalType = 'task' | 'household' | 'invite' | 'feedback'

interface PreparationModalState {
  type: ModalType
  household?: Household
}

interface PreparationDraft {
  title?: string
  due?: string
  name?: string
  response?: string
  people?: string | number
}

interface PreparationModalProps {
  modal: PreparationModalState
  draft: PreparationDraft
  setDraft: Dispatch<SetStateAction<PreparationDraft>>
  onClose: () => void
  onSave: () => void
}

function PreparationModal({ modal, draft, setDraft, onClose, onSave }: PreparationModalProps) {
  const isTask = modal.type === 'task'
  const isHousehold = modal.type === 'household'
  const isInvite = modal.type === 'invite'
  const title = isTask ? 'Thêm việc' : isHousehold ? 'Thêm nhà' : isInvite ? 'Ghi đã mời' : 'Ghi phản hồi'

  return (
    <div className="prep-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="prep-modal" onSubmit={(event) => { event.preventDefault(); onSave() }}>
        <h2>{title}</h2>
        {isTask && <>
          <label>Tên việc<input autoFocus value={draft.title ?? ''} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Lấy bánh tét" required /></label>
          <label>Hạn làm (không bắt buộc)<input value={draft.due ?? ''} onChange={(event) => setDraft({ ...draft, due: event.target.value })} placeholder="12/12/2026" /></label>
        </>}
        {isHousehold && <label>Tên nhà<input autoFocus value={draft.name ?? ''} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nhà cô Sáu" required /></label>}
        {(isInvite || modal.type === 'feedback') && <>
          <strong className="prep-modal__house">{modal.household!.name}</strong>
          <label>Phản hồi<select value={draft.response ?? ''} onChange={(event) => setDraft({ ...draft, response: event.target.value })}><option>Chưa trả lời</option><option>Có về</option><option>Không về</option></select></label>
          {modal.type === 'feedback' && draft.response === 'Có về' && <label>Số người<input type="number" min="1" value={draft.people ?? ''} onChange={(event) => setDraft({ ...draft, people: event.target.value })} required /></label>}
        </>}
        <div className="prep-modal__actions"><button type="button" onClick={onClose}>Hủy</button><button type="submit">{isTask ? 'Lưu việc' : isHousehold ? 'Thêm nhà' : 'Lưu'}</button></div>
      </form>
    </div>
  )
}

interface PreparationPageProps {
  occasions: MemorialEvent[]
  onUpdateOccasion: UpdateOccasion
  onNavigate: Navigate
  onLogout: () => void
}

export default function PreparationPage({ occasions, onUpdateOccasion, onNavigate, onLogout }: PreparationPageProps) {
  const [scale, setScale] = useState(() => window.innerWidth / 1672)
  const [tab, setTab] = useState<'tasks' | 'guests'>('tasks')
  const [occasionDate, setOccasionDate] = useState(() => occasions.find((item) => new Date(`${item.date}T00:00:00`) >= new Date())?.date ?? occasions.at(-1)!.date)
  const [doneOpen, setDoneOpen] = useState(false)
  const [modal, setModal] = useState<PreparationModalState | null>(null)
  const [draft, setDraft] = useState<PreparationDraft>({})
  const [toast, setToast] = useState<MemorialTask | null>(null)
  const occasion = occasions.find((item) => item.date === occasionDate) ?? occasions[0]
  const tasks = occasion.tasks
  const households = occasion.households
  const [pendingTasks, doneTasks] = splitByStatus(tasks)
  const [pendingHomes, invitedHomes] = splitByStatus(households, 'invited')

  useEffect(() => {
    document.documentElement.classList.add('home-is-open')
    window.scrollTo(0, 0)
    const updateScale = () => setScale(window.innerWidth / 1672)
    window.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      document.documentElement.classList.remove('home-is-open')
    }
  }, [])

  const openModal = (type: ModalType, household?: Household) => {
    setModal({ type, household })
    setDraft(type === 'task' ? { title: '', due: '' } : type === 'household' ? { name: '' } : { response: household?.response || 'Chưa trả lời', people: household?.people || '' })
  }

  const updateItems = <K extends 'tasks' | 'households'>(key: K, updater: (items: MemorialEvent[K]) => MemorialEvent[K]) => onUpdateOccasion(occasion.date, (item) => ({ ...item, [key]: updater(item[key]) }))

  const saveModal = () => {
    if (!modal) return
    if (modal.type === 'task') updateItems('tasks', (items) => [...items, { id: Date.now(), title: draft.title!.trim(), due: draft.due!.slice(0, 5), done: false }])
    if (modal.type === 'household') updateItems('households', (items) => [...items, { id: Date.now(), name: draft.name!.trim(), invited: false, response: '', people: '' }])
    if (modal.type === 'invite' || modal.type === 'feedback') updateItems('households', (items) => items.map((item) => item.id === modal.household!.id ? { ...item, invited: true, response: draft.response === 'Chưa trả lời' ? '' : draft.response ?? '', people: draft.response === 'Có về' ? Number(draft.people || 1) : '' } : item))
    setModal(null)
  }

  const completeTask = (task: MemorialTask) => {
    updateItems('tasks', (items) => items.map((item) => item.id === task.id ? { ...item, done: true } : item))
    setDoneOpen(true)
    setToast(task)
  }

  const undoTask = () => {
    if (!toast) return
    updateItems('tasks', (items) => items.map((item) => item.id === toast.id ? { ...item, done: false } : item))
    setToast(null)
  }

  return (
    <div className="prep-page">
      <div className="prep-stage" style={{ width: 1672 * scale, height: 1044 * scale }}>
        <div className="prep-canvas" style={{ transform: `scale(${scale})` }}>
          <AppHeader active="preparation" onNavigate={onNavigate} onLogout={onLogout} />
          <main className="prep-content">
            <button className="prep-back" type="button" onClick={() => onNavigate('calendar')}>← <span>Lịch giỗ</span></button>
            <div className="prep-title-row">
              <h1>Chuẩn bị</h1>
              <label>Dịp giỗ<select value={occasionDate} onChange={(event) => { setOccasionDate(event.target.value); setToast(null); setDoneOpen(false) }}>{occasions.map((item) => { const date = new Date(`${item.date}T00:00:00`); return <option value={item.date} key={item.date}>{item.title} · {date.getDate()}/{date.getMonth() + 1}</option> })}</select></label>
            </div>
            <div className="prep-tabs" role="tablist">
              <button className={tab === 'tasks' ? 'is-active' : ''} type="button" onClick={() => setTab('tasks')}>Việc cần lo</button>
              <button className={tab === 'guests' ? 'is-active' : ''} type="button" onClick={() => setTab('guests')}>Mời bà con</button>
            </div>

            {tab === 'tasks' ? <section className="prep-panel">
              <div className="prep-panel-heading"><h2>Còn {pendingTasks.length} việc</h2><button type="button" onClick={() => openModal('task')}>+ Thêm việc</button></div>
              <div className="prep-task-list">
                {pendingTasks.map((task) => <button type="button" className="prep-task" key={task.id} onClick={() => completeTask(task)}><i /><span><strong>{task.title}</strong>{task.due && <small>Hạn {task.due}</small>}</span><b>›</b></button>)}
              </div>
              <button className="prep-done-toggle" type="button" onClick={() => setDoneOpen(!doneOpen)}>Đã xong · {doneTasks.length} <span>{doneOpen ? '⌄' : '›'}</span></button>
              {doneOpen && <div className="prep-done-list">{doneTasks.map((task) => <div key={task.id}><i>✓</i><span>{task.title}</span></div>)}</div>}
            </section> : <section className="prep-panel prep-guests">
              <div className="prep-panel-heading"><h2>Còn {pendingHomes.length} nhà chưa mời</h2><button type="button" onClick={() => openModal('household')}>+ Thêm nhà</button></div>
              <div className="prep-home-list">{pendingHomes.map((household) => <div key={household.id}><strong>{household.name}</strong><button type="button" onClick={() => openModal('invite', household)}>Ghi đã mời</button></div>)}</div>
              <h3>Đã mời</h3>
              <div className="prep-invited-list">{invitedHomes.map((household) => <div key={household.id}><strong>{household.name}</strong><span>{household.response}{household.people ? ` · ${household.people} người` : ''}</span><button type="button" onClick={() => openModal('feedback', household)}>{household.response ? 'Sửa' : 'Ghi phản hồi'}</button></div>)}</div>
            </section>}
          </main>
          {toast && <div className="prep-toast"><span>Đã hoàn thành {toast.title}</span><button type="button" onClick={undoTask}>Hoàn tác</button></div>}
          {modal && <PreparationModal modal={modal} draft={draft} setDraft={setDraft} onClose={() => setModal(null)} onSave={saveModal} />}
        </div>
      </div>
    </div>
  )
}

