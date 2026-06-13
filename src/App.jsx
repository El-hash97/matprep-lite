import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import MobileNav from './components/MobileNav.jsx'
import Topbar from './components/Topbar.jsx'
import Calculator from './pages/Calculator.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'
import Landing from './pages/Landing.jsx'
import { DEF } from './data/defaults.js'

function clone(o) { return JSON.parse(JSON.stringify(o)) }
function loadS() { try { const s = localStorage.getItem('mpl_s2'); return s ? JSON.parse(s) : clone(DEF) } catch { return clone(DEF) } }
function loadH() { try { const h = localStorage.getItem('mpl_h2'); return h ? JSON.parse(h) : [] } catch { return [] } }

const PAGE_TITLES = {
  calc:     'Kalkulator Bon Material',
  history:  'Riwayat Bon',
  settings: 'Pengaturan Material',
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [page, setPage] = useState('calc')
  const [settings, setSettings] = useState(loadS)
  const [history, setHistory] = useState(loadH)

  useEffect(() => { localStorage.setItem('mpl_s2', JSON.stringify(settings)) }, [settings])
  useEffect(() => { localStorage.setItem('mpl_h2', JSON.stringify(history)) }, [history])

  const saveSettings  = (next) => setSettings(next)
  const resetSettings = () => setSettings(clone(DEF))
  const addHistory    = (rec) => setHistory(prev => [rec, ...prev])
  const deleteHistory = (id)  => setHistory(prev => prev.filter(x => x.id !== id))
  const clearHistory  = () => setHistory([])

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <Sidebar page={page} setPage={setPage} />

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-[220px] min-h-screen pb-16 md:pb-0">
        <Topbar title={PAGE_TITLES[page]} />

        <main className="flex-1 p-4 md:p-5">
          {page === 'calc' && (
            <Calculator
              settings={settings}
              onAddHistory={addHistory}
              history={history}
            />
          )}
          {page === 'history' && (
            <History
              history={history}
              settings={settings}
              onDelete={deleteHistory}
              onClear={clearHistory}
            />
          )}
          {page === 'settings' && (
            <Settings
              settings={settings}
              onSave={saveSettings}
              onReset={resetSettings}
            />
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav page={page} setPage={setPage} />
    </div>
  )
}
