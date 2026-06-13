const ICONS = {
  calc: 'M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4-3 3-3-3m3-3v11',
  history: 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  settings: 'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
}

const NAV = [
  { id: 'calc',     label: 'Kalkulator Bon' },
  { id: 'history',  label: 'Riwayat' },
  { id: 'settings', label: 'Pengaturan' },
]

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-[220px] bg-bg border-r border-hairline flex-col z-10">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-hairline">
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', textTransform: 'uppercase', color: '#ffffff' }}>
          Mat<span style={{ color: '#1c69d4' }}>Prep</span>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '10px', fontWeight: 300, letterSpacing: '1px', color: '#7e7e7e', marginLeft: '6px', textTransform: 'uppercase', verticalAlign: 'middle' }}>Lite</span>
        </div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#7e7e7e', marginTop: '2px', textTransform: 'uppercase' }}>
          TMMIN · Casting Division
        </div>
      </div>

      <div className="m-stripe" />

      {/* Nav */}
      <nav className="flex-1 pt-3">
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`nav-item w-full text-left ${page === n.id ? 'active' : ''}`}
          >
            <svg className="w-[14px] h-[14px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS[n.id]} />
            </svg>
            {n.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-hairline">
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#7e7e7e', textTransform: 'uppercase', lineHeight: 1.8 }}>
          PT TMMIN<br />Casting · EPSD Sunter 2
        </div>
      </div>
    </aside>
  )
}
