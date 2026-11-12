/*
Ngày âm lịch. 'leap' = true nếu là tháng nhuận, false nếu không phải. 'leap' = undefined nếu là ngày dương lịch.
 */

export interface LunarDate {
    year: number;
    month: number;
    day: number;
    leap?: boolean;
} 

export type Gender = 'male' | 'female';

 
export interface Ancestor {
  id: string
  fullName: string
  gender: Gender
  portraitId: string
  /** Lưu cả âm lịch (để hiển thị/cúng giỗ) lẫn dương lịch ISO (để so sánh QD-01). */
  birthLunar: LunarDate | null
  birthSolar: string | null // 'YYYY-MM-DD'
  deathLunar: LunarDate | null
  deathSolar: string | null
  note: string
}
 
/** Dữ liệu form: chưa có id, id do store cấp. */
export type AncestorInput = Omit<Ancestor, 'id'>
 
/** Giá trị thô của ô chọn ngày âm lịch (chuỗi rỗng = chưa chọn). */
export interface LunarDraft {
  year: string
  month: string
  day: string
  leap: boolean
}