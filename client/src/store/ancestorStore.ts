/**
 * Mock store trong bộ nhớ. Dùng useSyncExternalStore nên mọi component
 * dùng `useAncestors()` tự render lại khi dữ liệu đổi.
 * Các hàm ghi là async (có độ trễ giả) để sau này thay bằng axios/fetch
 * mà không phải sửa component.
 */
import { useSyncExternalStore } from 'react'
import type { Ancestor, AncestorInput } from '../types/ancestor'
import { lunarToIso } from '../utils/lunar'

const seedOne = (
  id: string,
  fullName: string,
  gender: Ancestor['gender'],
  portraitId: string,
  birth: Ancestor['birthLunar'],
  death: Ancestor['deathLunar'],
  note = '',
): Ancestor => ({
  id,
  fullName,
  gender,
  portraitId,
  birthLunar: birth,
  birthSolar: birth ? lunarToIso(birth) : null,
  deathLunar: death,
  deathSolar: death ? lunarToIso(death) : null,
  note,
})

let ancestors: readonly Ancestor[] = [
  seedOne('a1', 'Nguyễn Văn Hương', 'male', 'cu-ong',
    { day: 15, month: 3, year: 1920, leap: false },
    { day: 12, month: 8, year: 1995, leap: false }, 'Cụ tổ đời thứ nhất.'),
  seedOne('a2', 'Trần Thị Hoa', 'female', 'cu-ba',
    { day: 2, month: 10, year: 1925, leap: false },
    { day: 20, month: 1, year: 2003, leap: false }),
]

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms))

export const ancestorStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  /** Phải trả về CÙNG tham chiếu khi dữ liệu không đổi, nếu không React sẽ lặp vô hạn. */
  getSnapshot: () => ancestors,

  async add(input: AncestorInput): Promise<Ancestor> {
    await delay()
    const created: Ancestor = { ...input, id: crypto.randomUUID() }
    ancestors = [...ancestors, created] // tạo mảng MỚI (immutable)
    emit()
    return created
  },

  async update(id: string, input: AncestorInput): Promise<Ancestor> {
    await delay()
    const existing = ancestors.find((a) => a.id === id)
    if (!existing) throw new Error(`Không tìm thấy hồ sơ ${id}`)
    const updated: Ancestor = { ...input, id }
    ancestors = ancestors.map((a) => (a.id === id ? updated : a))
    emit()
    return updated
  },

  async remove(id: string): Promise<void> {
    await delay()
    ancestors = ancestors.filter((a) => a.id !== id)
    emit()
  },
}

export const useAncestors = () =>
  useSyncExternalStore(ancestorStore.subscribe, ancestorStore.getSnapshot)
