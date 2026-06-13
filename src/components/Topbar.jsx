import { useState, useEffect } from 'react'

export default function Topbar({ title }) {
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const fmt = () => new Date().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    setDateStr(fmt())
    const t = setInterval(() => setDateStr(fmt()), 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="sticky top-0 z-10 bg-bg border-b border-hairline flex flex-col">
      <div className="flex items-center justify-between px-5 md:px-6" style={{ height: '52px' }}>
        <span style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#ffffff',
        }}>{title}</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: '#7e7e7e',
          letterSpacing: '0.5px',
        }} className="hidden sm:block">{dateStr}</span>
      </div>
      <div className="m-stripe" />
    </header>
  )
}
