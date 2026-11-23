export type AppView = 'landing' | 'login' | 'register' | 'home' | 'calendar' | 'preparation' | 'family'
export type AppSection = Extract<AppView, 'home' | 'calendar' | 'preparation' | 'family'>
export type AuthMode = Extract<AppView, 'login' | 'register'>

export interface MemorialTask {
  id: string | number
  title: string
  due: string
  done: boolean
}

export interface Household {
  id: string | number
  name: string
  invited: boolean
  response: string
  people: number | ''
}

export interface MemorialEvent {
  date: string
  title: string
  lunar: string
  place: string
  tasks: MemorialTask[]
  households: Household[]
}

export interface FamilyMemberData {
  id: string
  role: string
  name: string
  years: string
  parents?: string
  partner?: string
  current?: boolean
}

export interface FamilyGeneration {
  label: string
  members: FamilyMemberData[]
}

export type Navigate = (view: AppView) => void
export type UpdateOccasion = (date: string, updater: (occasion: MemorialEvent) => MemorialEvent) => void
