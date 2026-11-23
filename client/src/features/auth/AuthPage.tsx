import { useEffect, useState } from 'react'
import type { HTMLInputTypeAttribute } from 'react'
import authArtwork from '../../assets/images/auth/generations-artwork.png'
import type { AuthMode } from '../../types/app'

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.4 12s3.5-6 9.6-6 9.6 6 9.6 6-3.5 6-9.6 6-9.6-6-9.6-6Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  )
}

function AuthBrand() {
  return (
    <div className="auth-brand" aria-label="Hương Hỏa — Gìn giữ nếp nhà Việt">
      <span className="auth-brand__name">Hương Hỏa</span>
      <span className="auth-brand__rule" />
      <span className="auth-brand__tagline">GÌN GIỮ<br />NẾP NHÀ VIỆT</span>
    </div>
  )
}

interface AuthFieldProps {
  label: string
  type?: HTMLInputTypeAttribute
  placeholder: string
}

function AuthField({ label, type = 'text', placeholder }: AuthFieldProps) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className="auth-field__control">
        <input type={type} placeholder={placeholder} />
        {type === 'password' && <button type="button" tabIndex={-1} aria-label="Hiện mật khẩu"><EyeIcon /></button>}
      </span>
    </label>
  )
}

interface AuthPageProps {
  mode: AuthMode
  onHome: () => void
  onSwitch: () => void
  onSubmit: () => void
}

export default function AuthPage({ mode, onHome, onSwitch, onSubmit }: AuthPageProps) {
  const isLogin = mode === 'login'
  const [scale, setScale] = useState(() => Math.min(window.innerWidth / 1672, window.innerHeight / 941))

  useEffect(() => {
    document.documentElement.classList.add('auth-is-open')
    window.scrollTo(0, 0)
    const updateScale = () => setScale(Math.min(window.innerWidth / 1672, window.innerHeight / 941))
    window.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      document.documentElement.classList.remove('auth-is-open')
    }
  }, [])

  return (
    <div className={`auth-page auth-page--${mode}`}>
      <div className="auth-stage" style={{ width: 1672 * scale, height: 941 * scale }}>
        <div className="auth-canvas" style={{ transform: `scale(${scale})` }}>
        <header className="auth-header">
          <AuthBrand />
          <button className="auth-home" type="button" onClick={onHome}><span>←</span> Về trang chủ</button>
        </header>
        <main className="auth-main">
          <div className="auth-artwork"><img src={authArtwork} alt="Những thế hệ người Việt gìn giữ nếp nhà" /></div>
          <section className="auth-panel" aria-labelledby="auth-title">
            <h1 id="auth-title">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h1>
            <p className="auth-panel__intro">{isLogin ? 'Chào mừng bạn trở về với nếp nhà.' : 'Tạo tài khoản để bắt đầu gìn giữ nếp nhà.'}</p>
            <form onSubmit={(event) => { event.preventDefault(); onSubmit() }}>
              {!isLogin && <AuthField label="Họ và tên" placeholder="Nguyễn Văn A" />}
              <AuthField label="Email" type="email" placeholder="example@gmail.com" />
              <AuthField label="Mật khẩu" type="password" placeholder="Nhập mật khẩu" />
              {!isLogin && <AuthField label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" />}
              {isLogin && <button className="auth-forgot" type="button">Quên mật khẩu?</button>}
              <button className="auth-submit" type="submit">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</button>
            </form>
            <p className="auth-switch">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button type="button" onClick={onSwitch}>{isLogin ? 'Đăng ký' : 'Đăng nhập'}</button>
            </p>
          </section>
        </main>
        </div>
      </div>
    </div>
  )
}

