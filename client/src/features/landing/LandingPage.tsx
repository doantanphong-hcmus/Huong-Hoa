import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import heroImage from '../../assets/images/landing/hero-incense-book.webp'
import memorialCalendarImage from '../../assets/images/landing/story-memorial-calendar.webp'
import familyGatheringImage from '../../assets/images/landing/story-family-gathering.webp'
import familyLegacyImage from '../../assets/images/landing/story-family-legacy.webp'
import footerIllustration from '../../assets/images/landing/footer-village.webp'
import arrowRight from '../../assets/images/landing/icons/arrow-right.svg'
import chevronDown from '../../assets/images/landing/icons/chevron-down.svg'
import closeIcon from '../../assets/images/landing/icons/close.svg'
import facebookIcon from '../../assets/images/landing/icons/facebook.svg'
import githubIcon from '../../assets/images/landing/icons/github.svg'
import mailIcon from '../../assets/images/landing/icons/mail.svg'
import mapPinIcon from '../../assets/images/landing/icons/map-pin.svg'
import menuIcon from '../../assets/images/landing/icons/menu.svg'
import phoneIcon from '../../assets/images/landing/icons/phone.svg'
import searchIcon from '../../assets/images/landing/icons/search.svg'
import youtubeIcon from '../../assets/images/landing/icons/youtube.svg'

interface Slide {
  image: string
  eyebrow: string
  title: ReactNode
  description: ReactNode
  action?: string
  type?: 'cover'
}

const slides: Slide[] = [
  {
    image: heroImage,
    eyebrow: 'HƯƠNG HỎA',
    title: <>Gìn giữ nếp nhà,<br />kết nối tình thân.</>,
    description: <>Một không gian số để nhớ, để chuẩn bị<br />và để những ngày giỗ luôn trọn vẹn.</>,
    type: 'cover',
  },
  {
    image: memorialCalendarImage,
    eyebrow: '02 — GÌN GIỮ',
    title: <>Ngày giỗ<br />chẳng phai.</>,
    description: 'Lưu giữ thông tin tổ tiên, ngày giỗ âm lịch và những dịp tưởng nhớ quan trọng, để dù đi đâu, ta vẫn luôn nhớ về cội nguồn.',
    action: 'Khám phá thêm',
  },
  {
    image: familyGatheringImage,
    eyebrow: '03 — SUM VẦY',
    title: <>Một ngày giỗ,<br />muôn tấm lòng.</>,
    description: 'Cùng nhau lên kế hoạch, phân công việc, chuẩn bị mâm cơm và mời người thân, để ngày giỗ không chỉ là tưởng nhớ, mà còn là dịp sum họp, gắn kết cả nhà.',
    action: 'Khám phá tính năng',
  },
  {
    image: familyLegacyImage,
    eyebrow: '04 — TIẾP NỐI',
    title: <>Để tình thân<br />nối dài.</>,
    description: 'Lưu giữ ký ức, câu chuyện và những giá trị gia đình qua từng thế hệ, để con cháu hôm nay vẫn luôn hiểu, nhớ và tự hào về cội nguồn.',
    action: 'Bắt đầu gìn giữ nếp nhà',
  },
]

function Brand() {
  return (
    <button className="brand" type="button" aria-label="Về đầu trang" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <span className="brand__name">Hương Hỏa</span>
      <span className="brand__rule" />
      <span className="brand__tagline">GÌN GIỮ<br />NẾP NHÀ VIỆT</span>
    </button>
  )
}

function Header({ onLogin }: { onLogin: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="header">
      <Brand />
      <nav className={menuOpen ? 'nav nav--open' : 'nav'} aria-label="Điều hướng chính">
        <button type="button">CÂU CHUYỆN</button>
        <button type="button">GIÁ TRỊ</button>
        <button className="nav__dropdown" type="button">TÍNH NĂNG <img src={chevronDown} alt="" /></button>
        <button className="nav__dropdown" type="button">CỘNG ĐỒNG <img src={chevronDown} alt="" /></button>
      </nav>
      <div className="header__actions">
        <button className="button button--primary" type="button">Bắt đầu ngay</button>
        <button className="button button--outline" type="button" onClick={onLogin}>Đăng nhập</button>
        <button className="icon-button header__search" type="button" aria-label="Tìm kiếm"><img src={searchIcon} alt="" /></button>
        <button className="icon-button header__menu" type="button" aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'} onClick={() => setMenuOpen(!menuOpen)}>
          <img src={menuOpen ? closeIcon : menuIcon} alt="" />
        </button>
      </div>
    </header>
  )
}


interface PaginationProps {
  active: number
  light?: boolean
}

function Pagination({ active, light = false }: PaginationProps) {
  return (
    <div className={light ? 'pagination pagination--light' : 'pagination'} aria-label={`Đang ở câu chuyện ${active + 1}`}>
      {slides.map((_, index) => (
        <span key={index} className={active === index ? 'is-active' : ''} aria-current={active === index ? 'step' : undefined}>
          {index + 1}
        </span>
      ))}
    </div>
  )
}

interface HeroProps {
  slide: Slide
  index: number
  active: number
}

function Hero({ slide, index, active }: HeroProps) {
  if (slide.type === 'cover') {
    return (
      <div className="scene scene--cover" aria-label="Câu chuyện 1" aria-hidden={active !== index}>
        <div className="hero hero--cover">
          <img className="hero__cover-image" src={slide.image} alt="Sổ gia phả và lư hương trong căn nhà Việt" />
          <div className="hero__shade" />
          <div className="cover-copy">
            <p className="cover-copy__eyebrow"><span />{slide.eyebrow}<span /></p>
            <h1>{slide.title}</h1>
            <div className="cover-copy__ornament"><span />✤<span /></div>
            <p>{slide.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="scene scene--split" aria-label={`Câu chuyện ${index + 1}`} aria-hidden={active !== index}>
      <div className={`hero hero--split hero--story-${index + 1}`}>
        <div className="split-copy">
          <div className="split-copy__eyebrow"><span>{slide.eyebrow}</span><i /></div>
          <h1>{slide.title}</h1>
          <p>{slide.description}</p>
          <button className="story-action" type="button">{slide.action}<img src={arrowRight} alt="" /></button>
        </div>
        <div className="split-image-wrap">
          <img className="split-image" src={slide.image} alt="Gia đình Việt quây quần gìn giữ ký ức" />
        </div>
      </div>
    </div>
  )
}

function ScrollShowcase() {
  const showcaseRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef(0)
  const wheelLock = useRef(false)
  const wheelTotal = useRef(0)
  const wheelTimer = useRef(0)
  const scrollAnimation = useRef(0)
  const [active, setActive] = useState(0)

  const animateScrollTo = (top: number) => {
    cancelAnimationFrame(scrollAnimation.current)
    document.documentElement.classList.add('is-programmatic-scroll')
    const start = window.scrollY
    const distance = top - start
    const startedAt = performance.now()
    const duration = 1050
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration)
      const eased = .5 - Math.cos(Math.PI * elapsed) / 2
      window.scrollTo(0, start + distance * eased)
      if (elapsed < 1) {
        scrollAnimation.current = requestAnimationFrame(tick)
      } else {
        scrollAnimation.current = 0
        document.documentElement.classList.remove('is-programmatic-scroll')
      }
    }
    scrollAnimation.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    slides.forEach(({ image }) => {
      const preload = new Image()
      preload.src = image
    })
    let frame = 0
    let metrics: { headerHeight: number; scrollStep: number; panelHeight: number; showcaseTop: number } | null = null
    const measure = () => {
      const showcase = showcaseRef.current
      if (!showcase) return
      metrics = {
        headerHeight: document.querySelector<HTMLElement>('.header')?.offsetHeight ?? 92,
        scrollStep: window.innerHeight,
        panelHeight: showcase.querySelector<HTMLElement>('.showcase__sticky')?.clientHeight ?? window.innerHeight,
        showcaseTop: showcase.offsetTop,
      }
    }
    const update = () => {
      frame = 0
      if (!metrics || !trackRef.current) return
      const { headerHeight, scrollStep, panelHeight, showcaseTop } = metrics
      const offset = Math.max(0, window.scrollY - showcaseTop + headerHeight)
      const progress = Math.max(0, Math.min(slides.length - 1, offset / scrollStep))
      trackRef.current.style.transform = `translate3d(0, ${-progress * panelHeight}px, 0)`
      const next = Math.round(progress)
      if (next !== activeRef.current) {
        activeRef.current = next
        setActive(next)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      onScroll()
    }
    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return
      const viewport = window.innerHeight
      const lastStop = slides.length
      const currentStop = Math.max(0, Math.min(lastStop, Math.round(window.scrollY / viewport)))
      const direction = Math.sign(event.deltaY)
      if (!direction || (currentStop === 0 && direction < 0) || (currentStop === lastStop && direction > 0)) return

      event.preventDefault()
      if (wheelLock.current) return
      wheelTotal.current += event.deltaY
      if (Math.abs(wheelTotal.current) < 8) return

      const target = Math.max(0, Math.min(lastStop, currentStop + Math.sign(wheelTotal.current)))
      wheelTotal.current = 0
      wheelLock.current = true
      animateScrollTo(target * viewport)
      window.clearTimeout(wheelTimer.current)
      wheelTimer.current = window.setTimeout(() => {
        wheelLock.current = false
      }, 1120)
    }
    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('wheel', onWheel)
      if (frame) cancelAnimationFrame(frame)
      cancelAnimationFrame(scrollAnimation.current)
      window.clearTimeout(wheelTimer.current)
      document.documentElement.classList.remove('is-programmatic-scroll')
    }
  }, [])

  return (
    <section ref={showcaseRef} className="showcase" aria-label="Câu chuyện Hương Hỏa">
      <div className="showcase__sticky">
        <div ref={trackRef} className="showcase__track">
          {slides.map((slide, index) => (
            <Hero key={index} slide={slide} index={index} active={active} />
          ))}
        </div>
        <Pagination active={active} light={active === 0} />
      </div>
      <div className="scroll-steps" aria-hidden="true">
        {slides.map((_, index) => <span key={index} />)}
      </div>
    </section>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return <div className="footer__column"><h2>{title}</h2>{children}</div>
}

function Footer() {
  return (
    <section id="footer" className="footer-view" aria-label="Thông tin Hương Hỏa">
      <img className="footer__panorama" src={footerIllustration} alt="Gia đình quây quần bên ngôi nhà Việt" />
      <footer className="footer">
      <div className="footer__grid">
        <div className="footer__intro">
          <div className="footer__brand">Hương Hỏa</div>
          <div className="footer__tagline">GÌN GIỮ NẾP NHÀ VIỆT</div>
          <p>Không chỉ là một ứng dụng, Hương Hỏa là<br />không gian số để gìn giữ ký ức tổ tiên, tổ chức<br />ngày giỗ và gắn kết các thế hệ trong gia đình.</p>
          <div className="socials">
            <button type="button" aria-label="Facebook"><img src={facebookIcon} alt="" /></button>
            <button type="button" aria-label="YouTube"><img src={youtubeIcon} alt="" /></button>
            <button type="button" aria-label="GitHub"><img src={githubIcon} alt="" /></button>
          </div>
        </div>
        <FooterColumn title="Về Hương Hỏa">
          <button type="button">Câu chuyện thương hiệu</button><button type="button">Giá trị cốt lõi</button><button type="button">Đội ngũ phát triển</button><button type="button">Liên hệ</button>
        </FooterColumn>
        <FooterColumn title="Tính năng">
          <button type="button">Quản lý gia đình</button><button type="button">Lịch giỗ âm – dương</button><button type="button">Chuẩn bị đám giỗ</button><button type="button">Lưu giữ ký ức</button><button type="button">Phân quyền thành viên</button>
        </FooterColumn>
        <FooterColumn title="Cộng đồng">
          <button type="button">Chia sẻ nếp nhà</button><button type="button">Câu chuyện gia đình</button><button type="button">Góp ý &amp; hỗ trợ</button><button type="button">Hỏi đáp thường gặp</button>
        </FooterColumn>
        <FooterColumn title="Liên hệ">
          <div className="contact"><img src={mapPinIcon} alt="" /><span>TP. Hồ Chí Minh, Việt Nam</span></div>
          <div className="contact"><img src={mailIcon} alt="" /><span>lienhe@huonghoa.vn</span></div>
          <div className="contact"><img src={phoneIcon} alt="" /><span>+84 90 123 4567</span></div>
        </FooterColumn>
      </div>
        <div className="footer__copyright">© 2026 Hương Hỏa. Tất cả quyền được bảo lưu.</div>
      </footer>
    </section>
  )
}


export default function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <>
      <Header onLogin={onLogin} />
      <main><ScrollShowcase /></main>
      <Footer />
    </>
  )
}
