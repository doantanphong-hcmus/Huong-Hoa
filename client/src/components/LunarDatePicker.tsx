import { useMemo } from 'react'
import type { LunarDraft } from '../types/ancestor'
import { daysInLunarMonth, formatIso, getLeapMonth } from '../utils/lunar'
import { parseDraft } from '../utils/lunarDraft'

const MIN_YEAR = 1800
const MAX_YEAR = new Date().getFullYear()

interface Props {
  idPrefix: string
  label: string
  value: LunarDraft
  onChange: (next: LunarDraft) => void
  error?: string
  required?: boolean
}

export function LunarDatePicker({ idPrefix, label, value, onChange, error, required }: Props) {
  const year = Number(value.year)
  const yearOk = Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR
  // Tháng nhuận của năm đang chọn (0 = không nhuận). Chỉ tính lại khi đổi năm.
  const leapMonth = useMemo(() => (yearOk ? getLeapMonth(year) : 0), [yearOk, year])

  const dayCount = (d: LunarDraft) => {
    const y = Number(d.year)
    const m = Number(d.month)
    return y >= MIN_YEAR && m ? daysInLunarMonth(y, m, d.leap) || 30 : 30
  }

  /** Mọi thay đổi đi qua đây để giữ dữ liệu nhất quán (nhuận hợp lệ, ngày không vượt số ngày của tháng). */
  const update = (patch: Partial<LunarDraft>) => {
    const next = { ...value, ...patch }
    const nextYear = Number(next.year)
    const nextLeapMonth =
      nextYear >= MIN_YEAR && nextYear <= MAX_YEAR ? getLeapMonth(nextYear) : 0
    if (next.leap && nextLeapMonth !== Number(next.month)) next.leap = false
    if (next.day && Number(next.day) > dayCount(next)) next.day = ''
    onChange(next)
  }

  const days = dayCount(value)
  const parsed = parseDraft(value)
  const canLeap = leapMonth !== 0 && Number(value.month) === leapMonth
  const errId = `${idPrefix}-error`

  return (
    <fieldset className="lunar-picker" aria-describedby={error ? errId : undefined}>
      <legend>
        {label} (âm lịch){required && <span aria-hidden="true"> *</span>}
      </legend>

      <div className="lunar-row">
        <label>
          Ngày
          <select
            id={`${idPrefix}-day`}
            value={value.day}
            onChange={(e) => update({ day: e.target.value })}
          >
            <option value="">--</option>
            {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label>
          Tháng
          <select
            id={`${idPrefix}-month`}
            value={value.month}
            onChange={(e) => update({ month: e.target.value })}
          >
            <option value="">--</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label>
          Năm
          <input
            id={`${idPrefix}-year`}
            type="number"
            inputMode="numeric"
            min={MIN_YEAR}
            max={MAX_YEAR}
            placeholder="1950"
            value={value.year}
            onChange={(e) => update({ year: e.target.value })}
          />
        </label>

        <label className="lunar-leap">
          <input
            type="checkbox"
            checked={value.leap}
            disabled={!canLeap}
            onChange={(e) => update({ leap: e.target.checked })}
          />
          Tháng nhuận
        </label>
      </div>

      {parsed.status === 'ok' && (
        <p className="hint">Dương lịch tương ứng: <strong>{formatIso(parsed.iso)}</strong></p>
      )}
      {leapMonth !== 0 && (
        <p className="hint">Năm {value.year} có tháng {leapMonth} nhuận.</p>
      )}
      {error && <p id={errId} className="field-error" role="alert">{error}</p>}
    </fieldset>
  )
}
