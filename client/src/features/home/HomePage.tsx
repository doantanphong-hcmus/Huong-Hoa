import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import backgroundImage from '../../assets/images/home/background.png'
import arrowRightIcon from '../../assets/images/home/icons/arrow-right.svg'
import chevronDownIcon from '../../assets/images/home/icons/chevron-down.svg'
import sunIcon from '../../assets/images/home/icons/sun.svg'
import type { MemorialEvent, MemorialTask, Navigate, UpdateOccasion } from '../../types/app'

interface HomePageProps {
  occasions: MemorialEvent[]
  onUpdateOccasion: UpdateOccasion
  onNavigate: Navigate
  onLogout: () => void
}

export default function HomePage({ occasions, onUpdateOccasion, onNavigate, onLogout }: HomePageProps) {
  const [scale, setScale] = useState(() => window.innerWidth / 1672)

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

  const today = new Date()
  const upcoming = occasions.find((occasion) => new Date(`${occasion.date}T00:00:00`) >= today) ?? occasions.at(-1)!
  const upcomingDate = new Date(`${upcoming.date}T00:00:00`)
  const weekday = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][upcomingDate.getDay()]
  const currentWeekday = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][today.getDay()]
  const visibleTasks = upcoming.tasks.filter((task) => !task.done).slice(0, 3)

  const toggleTask = (taskId: MemorialTask['id']) => onUpdateOccasion(upcoming.date, (occasion) => ({
    ...occasion,
    tasks: occasion.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task),
  }))

  return (
    <div className="home-page">
      <div className="home-stage" style={{ width: 1672 * scale, height: 1044 * scale }}>
        <div className="home-canvas" style={{ transform: `scale(${scale})` }}>
          <AppHeader active="home" onNavigate={onNavigate} onLogout={onLogout} />

          <main className="home-content" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <section className="home-welcome" aria-labelledby="home-greeting">
              <button className="home-family" type="button">Nhà họ Đoàn <img src={chevronDownIcon} alt="" /></button>
              <h1 id="home-greeting">Chào Phong</h1>
              <div className="home-memorial">
                <p className="home-memorial__eyebrow">NGÀY GIỖ SẮP TỚI</p>
                <h2>{upcoming.title}</h2>
                <p>{weekday}, {upcomingDate.getDate()}/{upcomingDate.getMonth() + 1} · {upcoming.lunar}</p>
                <p>{upcoming.place}</p>
                <button className="home-plan" type="button" onClick={() => onNavigate('preparation')}>Xem kế hoạch <img src={arrowRightIcon} alt="" /></button>
              </div>
            </section>

            <section className="home-tasks" aria-labelledby="home-tasks-title">
              <div className="home-date"><img src={sunIcon} alt="" /><span>{currentWeekday}, {today.getDate()}/{today.getMonth() + 1}</span></div>
              <div className="home-task-card">
                <h2 id="home-tasks-title">Việc của tôi</h2>
                <div className="home-task-list">
                  {visibleTasks.map((task) => (
                    <button className="home-task" type="button" key={task.id} onClick={() => toggleTask(task.id)}>
                      <span className="home-task__box" aria-hidden="true" />
                      <span className="home-task__copy"><strong>{task.title}</strong><small>{task.due && `Hạn ${task.due}`}</small></span>
                    </button>
                  ))}
                </div>
                <button className="home-task-more" type="button" onClick={() => onNavigate('preparation')}>Xem tất cả công việc <img src={arrowRightIcon} alt="" /></button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

