import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Ancestor, AncestorInput, Gender, LunarDraft } from '../types/ancestor'
import { DEFAULT_PORTRAIT_ID, PORTRAITS } from '../data/portraits'
import { ancestorStore } from '../store/ancestorStore'
import { todayIso } from '../utils/lunar'
import { EMPTY_DRAFT, lunarToDraft, parseDraft } from '../utils/lunarDraft'
import type { DraftResult } from '../utils/lunarDraft'
import { validateQd01 } from '../utils/validation'
import { LunarDatePicker } from './LunarDatePicker'
import './AncestorFormModal.css'

interface Props {
  open: boolean
  /** Có `ancestor` => chế độ sửa; không có => thêm mới. */
  ancestor?: Ancestor | null
  onClose: () => void
  onSaved?: (saved: Ancestor) => void
}

/** Vỏ ngoài: chỉ mount form khi mở => mỗi lần mở form có state mới tinh. */
export function AncestorFormModal({ open, ancestor, onClose, onSaved }: Props) {
  if (!open) return null
  return (
    <AncestorForm
      key={ancestor?.id ?? 'new'}
      ancestor={ancestor ?? null}
      onClose={onClose}
      onSaved={onSaved}
    />
  )
}

type Errors = Partial<Record<'fullName' | 'birth' | 'death' | 'form', string>>

const dateError = (r: DraftResult, required: boolean): string | undefined => {
  if (r.status === 'incomplete') return 'Vui lòng chọn đủ ngày, tháng, năm.'
  if (r.status === 'invalid') return 'Ngày âm lịch này không tồn tại.'
  if (r.status === 'empty' && required) return 'Vui lòng nhập ngày mất.'
  return undefined
}

function AncestorForm({
  ancestor,
  onClose,
  onSaved,
}: { ancestor: Ancestor | null; onClose: () => void; onSaved?: (a: Ancestor) => void }) {
  const isEdit = ancestor !== null
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [fullName, setFullName] = useState(ancestor?.fullName ?? '')
  const [gender, setGender] = useState<Gender>(ancestor?.gender ?? 'male')
  const [portraitId, setPortraitId] = useState(ancestor?.portraitId ?? DEFAULT_PORTRAIT_ID)
  const [birth, setBirth] = useState<LunarDraft>(lunarToDraft(ancestor?.birthLunar ?? null))
  const [deceased, setDeceased] = useState(ancestor ? ancestor.deathLunar !== null : true)
  const [death, setDeath] = useState<LunarDraft>(
    ancestor?.deathLunar ? lunarToDraft(ancestor.deathLunar) : EMPTY_DRAFT,
  )
  const [note, setNote] = useState(ancestor?.note ?? '')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string>()

  // Mở dạng modal thật (có backdrop, khoá focus, Esc để đóng). Guard cho StrictMode.
  useEffect(() => {
    const d = dialogRef.current
    if (d && !d.open) d.showModal()
  }, [])

  // Tính lỗi từ state hiện tại. Lỗi QD-01 hiện ngay khi đủ dữ liệu; lỗi "thiếu" chỉ hiện sau khi bấm Lưu.
  const { errors, birthR, deathR } = useMemo(() => {
    const birthR = parseDraft(birth)
    const deathR = deceased ? parseDraft(death) : ({ status: 'empty' } as DraftResult)
    const errs: Errors = {}

    if (!fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên.'
    errs.birth = dateError(birthR, false)
    errs.death = dateError(deathR, deceased)

    const qd01 = validateQd01({
      birthSolar: birthR.status === 'ok' ? birthR.iso : null,
      deathSolar: deathR.status === 'ok' ? deathR.iso : null,
      today: todayIso(),
    })
    errs.birth ??= qd01.birth
    errs.death ??= qd01.death
    return { errors: errs, birthR, deathR }
  }, [fullName, birth, death, deceased])

  const isQd01Error = (msg?: string) => !!msg && (msg.startsWith('QD-01') || msg.includes('tương lai'))
  const shown = (key: 'birth' | 'death') =>
    submitted || isQd01Error(errors[key]) ? errors[key] : undefined
  const hasErrors = Boolean(errors.fullName || errors.birth || errors.death)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (hasErrors) return

    const input: AncestorInput = {
      fullName: fullName.trim(),
      gender,
      portraitId,
      birthLunar: birthR.status === 'ok' ? birthR.lunar : null,
      birthSolar: birthR.status === 'ok' ? birthR.iso : null,
      deathLunar: deceased && deathR.status === 'ok' ? deathR.lunar : null,
      deathSolar: deceased && deathR.status === 'ok' ? deathR.iso : null,
      note: note.trim(),
    }

    setSaving(true)
    setServerError(undefined)
    try {
      const saved = isEdit
        ? await ancestorStore.update(ancestor.id, input)
        : await ancestorStore.add(input)
      onSaved?.(saved)
      onClose()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Không thể lưu hồ sơ.')
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="ancestor-modal"
      aria-labelledby="ancestor-modal-title"
      onCancel={(e) => {
        e.preventDefault() // chặn trình duyệt tự đóng; ta tự quyết (đang lưu thì không đóng)
        if (!saving) onClose()
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <header>
          <h2 id="ancestor-modal-title">{isEdit ? 'Chỉnh sửa hồ sơ' : 'Thêm hồ sơ tổ tiên'}</h2>
          <button type="button" className="icon-btn" aria-label="Đóng" onClick={onClose} disabled={saving}>
            ×
          </button>
        </header>

        <div className="modal-body">
          <fieldset className="portrait-picker">
            <legend>Ảnh chân dung</legend>
            <div className="portrait-grid">
              {PORTRAITS.map((p) => (
                <label key={p.id} className="portrait-option" title={p.label}>
                  <input
                    type="radio"
                    name="portrait"
                    value={p.id}
                    checked={portraitId === p.id}
                    onChange={() => setPortraitId(p.id)}
                  />
                  <img src={p.src} alt={p.label} width={64} height={64} />
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field">
            Họ và tên <span aria-hidden="true">*</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              aria-invalid={submitted && !!errors.fullName}
              autoFocus
            />
            {submitted && errors.fullName && (
              <span className="field-error" role="alert">{errors.fullName}</span>
            )}
          </label>

          <fieldset className="field inline">
            <legend>Giới tính</legend>
            <label><input type="radio" name="gender" checked={gender === 'male'} onChange={() => setGender('male')} /> Nam</label>
            <label><input type="radio" name="gender" checked={gender === 'female'} onChange={() => setGender('female')} /> Nữ</label>
          </fieldset>

          <LunarDatePicker idPrefix="birth" label="Ngày sinh" value={birth} onChange={setBirth} error={shown('birth')} />

          <label className="field inline">
            <input type="checkbox" checked={deceased} onChange={(e) => setDeceased(e.target.checked)} />
            Đã mất
          </label>

          {deceased && (
            <LunarDatePicker idPrefix="death" label="Ngày mất" value={death} onChange={setDeath} error={shown('death')} required />
          )}

          <label className="field">
            Ghi chú
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>

          {serverError && <p className="field-error" role="alert">{serverError}</p>}
        </div>

        <footer>
          <button type="button" className="btn" onClick={onClose} disabled={saving}>Huỷ</button>
          <button type="submit" className="btn primary" disabled={saving || (submitted && hasErrors)}>
            {saving ? 'Đang lưu…' : isEdit ? 'Lưu thay đổi' : 'Thêm mới'}
          </button>
        </footer>
      </form>
    </dialog>
  )
}
