import { getCalendarDays } from '../src/data/calendar.ts'

const november = getCalendarDays(2026, 10)
if (november.length !== 42) throw new Error('Calendar must always contain six weeks')
if (november[0].key !== '2026-10-26' || november[41].key !== '2026-12-06') throw new Error('November 2026 calendar range is incorrect')
if (november.filter((day) => day.inMonth).length !== 30) throw new Error('November 2026 must contain 30 days')

console.log('calendar data check passed')
