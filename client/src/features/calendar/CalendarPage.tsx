import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import { getCalendarDays } from '../../data/calendar'
import calendarScrollImage from '../../assets/images/calendar/calendar-scroll.webp'
import arrowRightIcon from '../../assets/images/home/icons/arrow-right.svg'
import type { MemorialEvent, Navigate } from '../../types/app'

const monthNames = ['THÁNG MỘT', 'THÁNG HAI', 'THÁNG BA', 'THÁNG TƯ', 'THÁNG NĂM', 'THÁNG SÁU', 'THÁNG BẢY', 'THÁNG TÁM', 'THÁNG CHÍN', 'THÁNG MƯỜI', 'THÁNG MƯỜI MỘT', 'THÁNG MƯỜI HAI']
const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

interface CalendarPageProps {
  occasions: MemorialEvent[]
  onNavigate: Navigate
  onLogout: () => void
}

export default function CalendarPage({ occasions, onNavigate, onLogout }: CalendarPageProps) {
  const [scale, setScale] = useState(() => window.innerWidth / 1672)
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2026, 10, 1))
  const [selectedDate, setSelectedDate] = useState('2026-11-29')

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

  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const days = getCalendarDays(year, month)
  const eventsByDate = new Map(occasions.map((event) => [event.date, event]))
  const monthEvents = occasions.filter((event) => {
    const date = new Date(`${event.date}T00:00:00`)
    return date.getFullYear() === year && date.getMonth() === month
  })
  const selectedEvent = eventsByDate.get(selectedDate) ?? monthEvents[0]

  const moveMonth = (amount: number) => {
    const next = new Date(year, month + amount, 1)
    setVisibleMonth(next)
    const prefix = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`
    setSelectedDate(occasions.find((event) => event.date.startsWith(prefix))?.date ?? '')
  }

  return (
    <div className="calendar-page">
      <div className="calendar-stage" style={{ width: 1672 * scale, height: 1200 * scale }}>
        <div className="calendar-canvas" style={{ transform: `scale(${scale})` }}>
          <AppHeader active="calendar" onNavigate={onNavigate} onLogout={onLogout} />
          <main className="calendar-content">
            <div className="calendar-heading">
              <div><p>GÌN GIỮ NGÀY ĐOÀN VIÊN</p><h1>Lịch giỗ gia đình</h1></div>
              <button type="button">+ Thêm ngày giỗ</button>
            </div>

            <section className="calendar-layout">
              <div className="calendar-bloc">
                <img src={calendarScrollImage} alt="" />
                <div className="calendar-sheet">
                  <div className="calendar-month-switcher">
                    <button type="button" onClick={() => moveMonth(-1)} aria-label="Tháng trước">‹</button>
                    <div><strong>{monthNames[month]}</strong><span>{year}</span></div>
                    <button type="button" onClick={() => moveMonth(1)} aria-label="Tháng sau">›</button>
                  </div>
                  <div className="calendar-weekdays">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
                  <div className="calendar-grid">
                    {days.map((day) => {
                      const event = eventsByDate.get(day.key)
                      return (
                        <button
                          className={`${day.inMonth ? '' : 'is-outside'} ${event ? 'has-event' : ''} ${selectedDate === day.key ? 'is-selected' : ''}`}
                          type="button"
                          key={day.key}
                          onClick={() => setSelectedDate(day.key)}
                          aria-label={`${day.date.getDate()}/${day.date.getMonth() + 1}/${day.date.getFullYear()}${event ? `, ${event.title}` : ''}`}
                        >
                          <span>{day.date.getDate()}</span>
                          {event && <i />}
                        </button>
                      )
                    })}
                  </div>
                  <p className="calendar-lunar-note">Ngày có dấu son là ngày giỗ trong gia đình</p>
                </div>
              </div>

              <aside className="calendar-events" aria-label="Ngày giỗ trong tháng">
                <p className="calendar-events__eyebrow">THÁNG {month + 1} · {year}</p>
                <h2>Ngày giỗ sắp tới</h2>
                <div className="calendar-event-list">
                  {monthEvents.length ? monthEvents.map((event) => {
                    const date = new Date(`${event.date}T00:00:00`)
                    return (
                      <button className={selectedDate === event.date ? 'is-active' : ''} type="button" key={event.date} onClick={() => setSelectedDate(event.date)}>
                        <span className="calendar-event-date"><strong>{date.getDate()}</strong><small>THÁNG {date.getMonth() + 1}</small></span>
                        <span className="calendar-event-copy"><strong>{event.title}</strong><small>{event.lunar}</small></span>
                      </button>
                    )
                  }) : <p className="calendar-events__empty">Tháng này chưa có ngày giỗ.</p>}
                </div>
                {selectedEvent && (
                  <div className="calendar-event-detail">
                    <span>NGÀY ĐƯỢC CHỌN</span>
                    <h3>{selectedEvent.title}</h3>
                    <p>{selectedEvent.lunar}</p>
                    <p>Địa điểm: {selectedEvent.place}</p>
                    <button type="button">Xem kế hoạch <img src={arrowRightIcon} alt="" /></button>
                  </div>
                )}
              </aside>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

