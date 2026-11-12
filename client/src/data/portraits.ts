/**
 * Ảnh chân dung mẫu. Dùng SVG data-URI nên không cần file ảnh trong /public;
 * sau này thay `src` bằng URL thật (ví dụ /portraits/ong-1.jpg) là xong.
 */
export interface Portrait {
  id: string
  label: string
  src: string
}

type Kind = 'male' | 'female'

function makePortrait(bg: string, hair: string, kind: Kind, elder: boolean): string {
  const skin = '#f1d3b3'
  const clothes = kind === 'male' ? '#334155' : '#7c2d12'
  const hairShape =
    kind === 'male'
      ? `<path d="M30 46c0-16 9-24 20-24s20 8 20 24c-6-9-12-12-20-12s-14 3-20 12z" fill="${hair}"/>`
      : `<circle cx="50" cy="20" r="9" fill="${hair}"/><path d="M29 50c0-18 9-26 21-26s21 8 21 26c-5-10-12-14-21-14s-16 4-21 14z" fill="${hair}"/>`
  const wrinkle = elder ? `<path d="M40 52h20" stroke="#c9a37f" stroke-width="1.5" fill="none"/>` : ''
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" fill="${bg}"/>` +
    `<path d="M12 100c2-22 16-32 38-32s36 10 38 32z" fill="${clothes}"/>` +
    `<rect x="44" y="58" width="12" height="12" fill="${skin}"/>` +
    `<ellipse cx="50" cy="46" rx="18" ry="22" fill="${skin}"/>` +
    hairShape +
    wrinkle +
    `<circle cx="43" cy="46" r="2" fill="#1e293b"/><circle cx="57" cy="46" r="2" fill="#1e293b"/>` +
    `<path d="M44 58q6 4 12 0" stroke="#7f1d1d" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const PORTRAITS: readonly Portrait[] = [
  { id: 'ong-1', label: 'Ông (tóc bạc)', src: makePortrait('#e2e8f0', '#cbd5e1', 'male', true) },
  { id: 'ong-2', label: 'Ông (trung niên)', src: makePortrait('#dbeafe', '#1e293b', 'male', false) },
  { id: 'ba-1', label: 'Bà (tóc bạc)', src: makePortrait('#fde68a', '#d1d5db', 'female', true) },
  { id: 'ba-2', label: 'Bà (trung niên)', src: makePortrait('#fbcfe8', '#111827', 'female', false) },
  { id: 'cu-ong', label: 'Cụ ông', src: makePortrait('#d9f99d', '#f1f5f9', 'male', true) },
  { id: 'cu-ba', label: 'Cụ bà', src: makePortrait('#c7d2fe', '#f8fafc', 'female', true) },
]

export const DEFAULT_PORTRAIT_ID = PORTRAITS[0].id

export function getPortraitSrc(id: string): string {
  return (PORTRAITS.find((p) => p.id === id) ?? PORTRAITS[0]).src
}