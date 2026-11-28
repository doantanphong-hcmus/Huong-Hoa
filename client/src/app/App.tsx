import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import AuthPage from '../features/auth/AuthPage'
import CalendarPage from '../features/calendar/CalendarPage'
import FamilyPage from '../features/family/FamilyPage'
import HomePage from '../features/home/HomePage'
import LandingPage from '../features/landing/LandingPage'
import PreparationPage from '../features/preparation/PreparationPage'
import { memorialEvents } from '../data/calendar'
import { loadFamily, saveFamilyMember } from '../data/familyStore'
import type { FamilyMemberDraft, FamilyMemberRecord } from '../data/familyStore'
import { supabase } from '../lib/supabase'
import type { AppView, UpdateOccasion } from '../types/app'

export default function App() {
  const [view, setView] = useState<AppView>('landing')
  const [session, setSession] = useState<Session | null>(null)
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase))
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [family, setFamily] = useState<FamilyMemberRecord[]>([])
  const [familyError, setFamilyError] = useState('')
  const [occasions, setOccasions] = useState(memorialEvents)
  const userId = session?.user.id
  const updateOccasion: UpdateOccasion = (date, updater) => setOccasions((items) => items.map((item) => item.date === date ? updater(item) : item))

  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) setAuthError(error.message)
      setSession(data.session)
      if (data.session) setView('home')
      setCheckingSession(false)
    }).catch((error: unknown) => {
      if (!active) return
      setAuthError(error instanceof Error ? error.message : 'Không kiểm tra được phiên đăng nhập.')
      setCheckingSession(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      if (!nextSession) setView((current) => current === 'landing' ? current : 'login')
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!userId) { setFamily([]); return }
    let active = true
    void loadFamily().then((members) => {
      if (active) { setFamily(members); setFamilyError('') }
    }).catch((error: unknown) => {
      if (active) setFamilyError(error instanceof Error ? error.message : 'Không tải được dữ liệu gia phả.')
    })
    return () => { active = false }
  }, [userId])

  const submitAuth = async (email: string, password: string, name: string) => {
    setAuthError('')
    setAuthNotice('')
    if (!supabase) { setAuthError('Chưa cấu hình Supabase. Xem client/.env.example.'); return }
    try {
      const result = view === 'register'
        ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name.trim() } } })
        : await supabase.auth.signInWithPassword({ email, password })
      if (result.error) { setAuthError(result.error.message); return }
      if (result.data.session) { setSession(result.data.session); setView('home') }
      else setAuthNotice('Hãy kiểm tra email để xác nhận tài khoản, rồi đăng nhập.')
    } catch (error) {
      setAuthError(error instanceof Error && error.message === 'Failed to fetch'
        ? 'Không kết nối được Supabase. Kiểm tra Project URL trong client/.env.local rồi khởi động lại frontend.'
        : error instanceof Error ? error.message : 'Không kết nối được Supabase.')
    }
  }

  const logout = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) { setFamilyError(error.message); return }
    }
    setSession(null)
    setView('landing')
  }

  const saveMember = async (member: FamilyMemberDraft) => {
    const id = await saveFamilyMember(member)
    try { setFamily(await loadFamily()); setFamilyError('') }
    catch (error) { setFamilyError(error instanceof Error ? error.message : 'Đã lưu hồ sơ nhưng chưa tải lại được dữ liệu.') }
    return id
  }

  if (checkingSession) return <main style={{ padding: 32 }}>Đang kiểm tra phiên đăng nhập…</main>
  if (!session && view !== 'login' && view !== 'register') return <LandingPage onLogin={() => { setAuthError(''); setAuthNotice(''); setView('login') }} />
  if (view === 'login' || view === 'register') {
    return <AuthPage mode={view} onHome={() => setView('landing')} onSwitch={() => { setAuthError(''); setAuthNotice(''); setView(view === 'login' ? 'register' : 'login') }} onSubmit={submitAuth} error={authError} notice={authNotice} />
  }
  if (view === 'home') return <HomePage occasions={occasions} onUpdateOccasion={updateOccasion} onNavigate={setView} onLogout={() => { void logout() }} />
  if (view === 'calendar') return <CalendarPage occasions={occasions} onNavigate={setView} onLogout={() => { void logout() }} />
  if (view === 'preparation') return <PreparationPage occasions={occasions} onUpdateOccasion={updateOccasion} onNavigate={setView} onLogout={() => { void logout() }} />
  if (view === 'family') return <FamilyPage members={family} error={familyError} onSaveMember={saveMember} onNavigate={setView} onLogout={() => { void logout() }} />
  return <LandingPage onLogin={() => setView('login')} />
}
