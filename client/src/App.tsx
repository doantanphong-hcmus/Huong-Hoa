import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Dự án SE</p>
        <h1>Project boilerplate</h1>
        <p className="subtitle">
          Frontend và backend đã sẵn sàng để bắt đầu phát triển tính năng mới.
        </p>
      </section>

      <section className="status-grid">
        <article className="status-card">
          <span className="label">Frontend</span>
          <strong>React + Vite</strong>
        </article>
        <article className="status-card">
          <span className="label">Backend</span>
          <strong>NestJS</strong>
        </article>
        <article className="status-card">
          <span className="label">Status</span>
          <strong>Ready</strong>
        </article>
      </section>
    </main>
  )
}

export default App
