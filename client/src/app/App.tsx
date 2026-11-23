import { useState } from 'react'
import AuthPage from '../features/auth/AuthPage'
import CalendarPage from '../features/calendar/CalendarPage'
import FamilyPage from '../features/family/FamilyPage'
import HomePage from '../features/home/HomePage'
import LandingPage from '../features/landing/LandingPage'
import PreparationPage from '../features/preparation/PreparationPage'
import { memorialEvents } from '../data/calendar'
import type { AppView, UpdateOccasion } from '../types/app'

export default function App() {
  const [view, setView] = useState<AppView>('landing')
  const [occasions, setOccasions] = useState(memorialEvents)
  const updateOccasion: UpdateOccasion = (date, updater) => setOccasions((items) => items.map((item) => item.date === date ? updater(item) : item))

  if (view === 'home') return <HomePage occasions={occasions} onUpdateOccasion={updateOccasion} onNavigate={setView} onLogout={() => setView('landing')} />
  if (view === 'calendar') return <CalendarPage occasions={occasions} onNavigate={setView} onLogout={() => setView('landing')} />
  if (view === 'preparation') return <PreparationPage occasions={occasions} onUpdateOccasion={updateOccasion} onNavigate={setView} onLogout={() => setView('landing')} />
  if (view === 'family') return <FamilyPage onNavigate={setView} onLogout={() => setView('landing')} />
  if (view === 'login' || view === 'register') {
    return <AuthPage mode={view} onHome={() => setView('landing')} onSwitch={() => setView(view === 'login' ? 'register' : 'login')} onSubmit={() => setView('home')} />
  }
  return <LandingPage onLogin={() => setView('login')} />
}
