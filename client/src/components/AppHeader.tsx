import bellIcon from '../assets/images/home/icons/bell.svg'
import avatarIcon from '../assets/images/home/icons/avatar-default.svg'
import chevronDownIcon from '../assets/images/home/icons/chevron-down.svg'
import type { AppSection, Navigate } from '../types/app'

function HomeBrand() {
  return (
    <div className="home-brand" aria-label="Hương Hỏa — Gìn giữ nếp nhà Việt">
      <span className="home-brand__name">Hương Hỏa</span>
      <span className="home-brand__rule" />
      <span className="home-brand__tagline">GÌN GIỮ<br />NẾP NHÀ VIỆT</span>
    </div>
  )
}

const appNavigation = [
  ['home', 'Trang chủ'],
  ['calendar', 'Lịch giỗ'],
  ['preparation', 'Chuẩn bị'],
  ['family', 'Gia đình'],
  ['memories', 'Ký ức'],
] as const satisfies ReadonlyArray<readonly [AppSection | 'memories', string]>

interface AppHeaderProps {
  active: AppSection
  onNavigate: Navigate
  onLogout: () => void
}

export default function AppHeader({ active, onNavigate, onLogout }: AppHeaderProps) {
  return (
    <header className="home-header">
      <HomeBrand />
      <nav className="home-nav" aria-label="Điều hướng chính">
        {appNavigation.map(([view, label]) => (
          <button className={active === view ? 'is-active' : ''} type="button" key={view} onClick={() => view !== 'memories' && onNavigate(view)}>{label}</button>
        ))}
      </nav>
      <div className="home-account">
        <button className="home-account__bell" type="button" aria-label="Thông báo"><img src={bellIcon} alt="" /></button>
        <span className="home-account__rule" />
        <button className="home-account__profile" type="button" onClick={onLogout} aria-label="Mở tài khoản của Tấn Phong">
          <span className="home-account__avatar"><img src={avatarIcon} alt="" /></span>
          <span>Tấn Phong</span>
          <img className="home-account__chevron" src={chevronDownIcon} alt="" />
        </button>
      </div>
    </header>
  )
}

