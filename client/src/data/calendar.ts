import type { MemorialEvent } from '../types/app'

export const memorialEvents: MemorialEvent[] = [
  { date: '2026-11-05', title: 'Giỗ cụ bà Nguyễn Thị Sen', lunar: '26/09 âm lịch', place: 'Từ đường họ Đoàn', tasks: [], households: [] },
  { date: '2026-11-18', title: 'Giỗ bác Cả', lunar: '09/10 âm lịch', place: 'Nhà cô Ba', tasks: [], households: [] },
  {
    date: '2026-11-29', title: 'Giỗ ông nội', lunar: '21/10 âm lịch', place: 'Nhà bác Hai',
    tasks: [
      { id: '29-1', title: 'Xác nhận số người tham dự', due: '22/11', done: false },
      { id: '29-2', title: 'Đặt trái cây cúng', due: '25/11', done: false },
      { id: '29-3', title: 'Gọi mời cô Ba', due: '27/11', done: false },
      { id: '29-4', title: 'Chốt giờ cúng', due: '', done: true },
    ],
    households: [
      { id: '29-h1', name: 'Nhà chú Tư', invited: false, response: '', people: '' },
      { id: '29-h2', name: 'Nhà dì Năm', invited: false, response: '', people: '' },
      { id: '29-h3', name: 'Nhà bác Hai', invited: true, response: 'Có về', people: 3 },
      { id: '29-h4', name: 'Nhà cô Ba', invited: true, response: '', people: '' },
    ],
  },
  {
    date: '2026-12-13', title: 'Giỗ bà nội', lunar: '05/11 âm lịch', place: 'Từ đường họ Đoàn',
    tasks: [
      { id: '13-1', title: 'Đặt bánh tét', due: '10/12', done: false },
      { id: '13-2', title: 'Mua trái cây', due: '12/12', done: false },
      { id: '13-3', title: 'Kiểm tra chén đũa', due: '', done: false },
      { id: '13-4', title: 'Chốt giờ cúng', due: '', done: true },
    ],
    households: [
      { id: '13-h1', name: 'Nhà chú Tư', invited: false, response: '', people: '' },
      { id: '13-h2', name: 'Nhà dì Năm', invited: false, response: '', people: '' },
      { id: '13-h3', name: 'Nhà bác Hai', invited: true, response: 'Có về', people: 3 },
      { id: '13-h4', name: 'Nhà cô Ba', invited: true, response: '', people: '' },
    ],
  },
]

export function formatDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const mondayOffset = (firstDay.getDay() + 6) % 7
  const start = new Date(year, month, 1 - mondayOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return { date, key: formatDateKey(date), inMonth: date.getMonth() === month }
  })
}
