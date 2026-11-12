/*
    QD-01: Ngày mất 
    - Không được ở tương lai 
    - Không được trước ngày sinh
 */

export interface QD01Input{
    birthSolar: string | null // 'YYYY-MM-DD'
    deathSolar: string | null // 'YYYY-MM-DD'
    today: string // 'YYYY-MM-DD'
}

export interface QD01Errors{
    birth?: string 
    death?: string
}
export function validateQd01({ birthSolar, deathSolar, today }: QD01Input): QD01Errors {
  const errors: QD01Errors = {}
  if (birthSolar && birthSolar > today) {
    errors.birth = 'Ngày sinh không được ở tương lai.'
  }
  if (deathSolar) {
    if (deathSolar > today) {
      errors.death = 'QD-01: Ngày mất không được ở tương lai.'
    } else if (birthSolar && deathSolar < birthSolar) {
      errors.death = 'QD-01: Ngày mất không được trước ngày sinh.'
    }
  }
  return errors
}

