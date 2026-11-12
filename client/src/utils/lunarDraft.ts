import type { LunarDate, LunarDraft } from '../types/ancestor'
import { lunarToIso } from './lunar'
 
export const EMPTY_DRAFT: LunarDraft = { year: '', month: '', day: '', leap: false }
 
export const lunarToDraft = (l: LunarDate | null): LunarDraft =>
  l ? { year: String(l.year), month: String(l.month), day: String(l.day), leap: l.leap ?? false } : EMPTY_DRAFT
 
export type DraftResult =
  | { status: 'empty' }
  | { status: 'incomplete' }
  | { status: 'invalid' }
  | { status: 'ok'; lunar: LunarDate; iso: string }
 
/** Biến giá trị thô của ô chọn ngày thành kết quả đã kiểm tra. */
export function parseDraft(d: LunarDraft): DraftResult {
  const filled = [d.year, d.month, d.day].filter((v) => v !== '').length
  if (filled === 0) return { status: 'empty' }
  if (filled < 3) return { status: 'incomplete' }
  const lunar: LunarDate = {
    year: Number(d.year),
    month: Number(d.month),
    day: Number(d.day),
    leap: d.leap,
  }
  if (!Number.isInteger(lunar.year) || lunar.year < 1000) return { status: 'invalid' }
  const iso = lunarToIso(lunar)
  return iso ? { status: 'ok', lunar, iso } : { status: 'invalid' }
}