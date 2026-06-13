import { useEffect, useState } from 'react'

const FEATURES = [
  { label: 'Konversi Lot Otomatis', color: '#0066b1' },
  { label: 'Akumulasi Material',    color: '#1c69d4' },
  { label: 'Riwayat & Rekap',       color: '#e22718' },
  { label: 'Cetak Bon PDF',         color: '#0fa336' },
]

export default function Landing({ onEnter }) {
  const [ready,   setReady]   = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = () => {
    setExiting(true)
    setTimeout(onEnter, 480)
  }

  const cls = ['landing', ready ? 'landing--ready' : '', exiting ? 'landing--exit' : '']
    .filter(Boolean).join(' ')

  return (
    <div className={cls}>
      {/* dot grid */}
      <div className="landing-dots" />

      {/* atmospheric blue glow */}
      <div className="landing-glow" />

      {/* scan line — sweeps once on load */}
      <div className="landing-scan" />

      {/* main content */}
      <div className="landing-body">
        {/* company label */}
        <p className="landing-company">
          PT TMMIN · Casting Division · EPSD Sunter 2
        </p>

        {/* brand */}
        <div className="landing-brand-wrap">
          <h1 className="landing-title">
            <span className="landing-mat">Mat</span>
            <span className="landing-prep">Prep</span>
          </h1>
          <p className="landing-slogan">Hitung Cepat dan Tepat</p>
          <div className="landing-sub-row">
            <span className="landing-lite">Lite</span>
            <div className="landing-mstripe" />
          </div>
        </div>

        {/* divider line extends from left */}
        <div className="landing-rule" />

        {/* tagline */}
        <h2 className="landing-tagline">
          Sistem Perhitungan Bon Material Produksi
        </h2>

        {/* description */}
        <p className="landing-desc">
          Kalkulasi kebutuhan material presisi — otomatis mengkonversi lot kecil
          ke lot besar, akumulasi lintas produk{' '}
          <strong>2TR</strong>, <strong>1TR</strong>, <strong>KAI</strong>, dan{' '}
          <strong>CRANK</strong>, lalu membulatkan ke karung penuh.
        </p>

        {/* feature badges */}
        <div className="landing-features">
          {FEATURES.map(f => (
            <div key={f.label} className="landing-feature">
              <span className="landing-feature-dot" style={{ background: f.color }} />
              {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* version stamp */}
      <div className="landing-version">
        MatPrep Lite · v1.0 · 4 Produk · 10 Material
      </div>

      {/* get started — bottom right */}
      <button className="landing-cta" onClick={handleEnter}>
        <span>Get Started</span>
        <svg
          className="landing-cta-arrow"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
