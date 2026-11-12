/*
Chuyển đổi dương lịch -> âm lịch Việt Nam
 */

import type { LunarDate } from '../types/ancestor';

const TZ = 7; // múi giờ Việt Nam
const int = Math.floor
const DR = Math.PI / 180
 
function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = int((14 - mm) / 12)
  const y = yy + 4800 - a
  const m = mm + 12 * a - 3
  let jd =
    dd + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - int(y / 100) + int(y / 400) - 32045
  if (jd < 2299161) jd = dd + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - 32083
  return jd
}
 
function jdToDate(jd: number): [number, number, number] {
  let b: number
  let c: number
  if (jd > 2299160) {
    const a = jd + 32044
    b = int((4 * a + 3) / 146097)
    c = a - int((b * 146097) / 4)
  } else {
    b = 0
    c = jd + 32083
  }
  const d = int((4 * c + 3) / 1461)
  const e = c - int((1461 * d) / 4)
  const m = int((5 * e + 2) / 153)
  const day = e - int((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * int(m / 10)
  const year = b * 100 + d - 4800 + int(m / 10)
  return [day, month, year]
}
 
function newMoon(k: number): number {
  const T = k / 1236.85
  const T2 = T * T
  const T3 = T2 * T
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * DR)
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3
  let c1 = (0.1734 - 0.000393 * T) * Math.sin(M * DR) + 0.0021 * Math.sin(2 * DR * M)
  c1 += -0.4068 * Math.sin(Mpr * DR) + 0.0161 * Math.sin(DR * 2 * Mpr)
  c1 -= 0.0004 * Math.sin(DR * 3 * Mpr)
  c1 += 0.0104 * Math.sin(DR * 2 * F) - 0.0051 * Math.sin(DR * (M + Mpr))
  c1 += -0.0074 * Math.sin(DR * (M - Mpr)) + 0.0004 * Math.sin(DR * (2 * F + M))
  c1 += -0.0004 * Math.sin(DR * (2 * F - M)) - 0.0006 * Math.sin(DR * (2 * F + Mpr))
  c1 += 0.001 * Math.sin(DR * (2 * F - Mpr)) + 0.0005 * Math.sin(DR * (2 * Mpr + M))
  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2
  return jd1 + c1 - deltat
}
 
function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525
  const T2 = T * T
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(DR * M)
  DL += (0.019993 - 0.000101 * T) * Math.sin(DR * 2 * M) + 0.00029 * Math.sin(DR * 3 * M)
  let L = (L0 + DL) * DR
  L -= Math.PI * 2 * int(L / (Math.PI * 2))
  return L
}
 
const getSunLongitude = (day: number) => int((sunLongitude(day - 0.5 - TZ / 24) / Math.PI) * 6)
const getNewMoonDay = (k: number) => int(newMoon(k) + 0.5 + TZ / 24)
 
function getLunarMonth11(yy: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021
  const k = int(off / 29.530588853)
  let nm = getNewMoonDay(k)
  if (getSunLongitude(nm) >= 9) nm = getNewMoonDay(k - 1)
  return nm
}
 
function getLeapMonthOffset(a11: number): number {
  const k = int((a11 - 2415021.076998695) / 29.530588853 + 0.5)
  let last = 0
  let i = 1
  let arc = getSunLongitude(getNewMoonDay(k + i))
  do {
    last = arc
    i++
    arc = getSunLongitude(getNewMoonDay(k + i))
  } while (arc !== last && i < 14)
  return i - 1
}
 
/** Dương -> âm. */
export function solarToLunar(dd: number, mm: number, yy: number): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy)
  const k = int((dayNumber - 2415021.076998695) / 29.530588853)
  let monthStart = getNewMoonDay(k + 1)
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k)
  let a11 = getLunarMonth11(yy)
  let b11 = a11
  let year: number
  if (a11 >= monthStart) {
    year = yy
    a11 = getLunarMonth11(yy - 1)
  } else {
    year = yy + 1
    b11 = getLunarMonth11(yy + 1)
  }
  const day = dayNumber - monthStart + 1
  const diff = int((monthStart - a11) / 29)
  let leap = false
  let month = diff + 11
  if (b11 - a11 > 365) {
    const leapDiff = getLeapMonthOffset(a11)
    if (diff >= leapDiff) {
      month = diff + 10
      if (diff === leapDiff) leap = true
    }
  }
  if (month > 12) month -= 12
  if (month >= 11 && diff < 4) year -= 1
  return { day, month, year, leap }
}
 
/** Âm -> dương. Trả null nếu tổ hợp không hợp lệ (vd: tháng nhuận không tồn tại). */
export function lunarToSolar(l: LunarDate): [number, number, number] | null {
  const { day, month, year, leap } = l
  let a11: number
  let b11: number
  if (month < 11) {
    a11 = getLunarMonth11(year - 1)
    b11 = getLunarMonth11(year)
  } else {
    a11 = getLunarMonth11(year)
    b11 = getLunarMonth11(year + 1)
  }
  const k = int(0.5 + (a11 - 2415021.076998695) / 29.530588853)
  let off = month - 11
  if (off < 0) off += 12
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11)
    let leapMonth = leapOff - 2
    if (leapMonth < 0) leapMonth += 12
    if (leap && month !== leapMonth) return null
    if (leap || off >= leapOff) off += 1
  } else if (leap) {
    return null
  }
  return jdToDate(getNewMoonDay(k + off) + day - 1)
}
 
const pad = (n: number, w = 2) => String(n).padStart(w, '0')
export const toIso = (y: number, m: number, d: number) => `${pad(y, 4)}-${pad(m)}-${pad(d)}`
 
/** Ngày hôm nay theo GIỜ ĐỊA PHƯƠNG (không dùng toISOString vì nó trả UTC, có thể lệch ngày ở VN). */
export function todayIso(now: Date = new Date()): string {
  return toIso(now.getFullYear(), now.getMonth() + 1, now.getDate())
}
 
const sameLunar = (a: LunarDate, b: LunarDate) =>
  a.day === b.day && a.month === b.month && a.year === b.year && a.leap === b.leap
 
/** Ngày âm có thật không? (vd: 30/2 của tháng thiếu thì không). Kiểm bằng cách đổi qua lại. */
export function lunarExists(l: LunarDate): boolean {
  if (l.day < 1 || l.day > 30 || l.month < 1 || l.month > 12) return false
  const s = lunarToSolar(l)
  if (!s) return false
  return sameLunar(solarToLunar(s[0], s[1], s[2]), l)
}
 
/** Âm -> chuỗi dương lịch ISO, hoặc null nếu ngày không tồn tại. */
export function lunarToIso(l: LunarDate): string | null {
  if (!lunarExists(l)) return null
  const s = lunarToSolar(l)!
  return toIso(s[2], s[1], s[0])
}
 
/** Tháng nhuận của năm âm lịch (0 nếu năm không nhuận). */
export function getLeapMonth(year: number): number {
  for (let m = 1; m <= 12; m++) {
    if (lunarExists({ day: 1, month: m, year, leap: true })) return m
  }
  return 0
}
 
/** Số ngày của tháng âm (29 hoặc 30), 0 nếu tháng không tồn tại. */
export function daysInLunarMonth(year: number, month: number, leap: boolean): number {
  if (lunarExists({ day: 30, month, year, leap })) return 30
  if (lunarExists({ day: 29, month, year, leap })) return 29
  return 0
}
 
export function formatLunar(l: LunarDate | null): string {
  if (!l) return '—'
  return `${pad(l.day)}/${pad(l.month)}${l.leap ? ' (nhuận)' : ''}/${l.year} ÂL`
}
 
export function formatIso(iso: string | null): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
 