import { useState } from 'react'
import { PRODS, PROD_LABELS, TAG_CLASS, ACCENT_CLS, ACCENT_COLOR } from '../data/defaults.js'

function toLB(k, ratio) { return Math.ceil(k / (ratio || 3)) }

function ProdTag({ prod }) {
  const key = prod.toLowerCase().replace(/[^a-z0-9]/g, '')
  const cls = { '2tr': 'tag-blue', '1tr': 'tag-teal', kai: 'tag-green', crank: 'tag-amber' }
  return <span className={`tag ${cls[key] || 'tag-blue'} mr-1`}>{prod}</span>
}

function buildBon(inputs, settings) {
  const lots = {}
  PRODS.forEach(p => {
    const k = parseFloat(inputs[p]) || 0
    lots[p] = { kecil: k, besar: toLB(k, settings.ratio) }
  })
  if (PRODS.every(p => lots[p].kecil === 0)) return null

  const raw = []
  PRODS.forEach(p => {
    if (!lots[p].kecil) return
    settings[p].forEach(m => {
      const exact = +(m.perLot * lots[p].besar).toFixed(3)
      raw.push({ produk: PROD_LABELS[p], name: m.name, unit: m.unit, exact })
    })
  })

  const merged = {}
  raw.forEach(r => {
    if (!merged[r.name]) merged[r.name] = { name: r.name, unit: r.unit, produks: [], exactTotal: 0, sackSize: settings.sacks[r.name] || 1 }
    merged[r.name].exactTotal = +(merged[r.name].exactTotal + r.exact).toFixed(3)
    if (!merged[r.name].produks.includes(r.produk)) merged[r.name].produks.push(r.produk)
  })

  const rows = Object.values(merged).map(m => {
    const karung = Math.ceil(+(m.exactTotal / m.sackSize).toFixed(9))
    return { ...m, karung, final: karung * m.sackSize }
  })
  return { rows, lots }
}

function printBon(bon, date) {
  const info = PRODS.filter(p => bon.lots[p].kecil > 0)
    .map(p => `${PROD_LABELS[p]}: ${bon.lots[p].kecil} lot kecil → ${bon.lots[p].besar} lot besar`)
    .join(' | ')
  const tRows = bon.rows.map(r =>
    `<tr><td>${r.name}</td><td>${r.produks.join(', ')}</td><td class="r">${r.exactTotal} ${r.unit}</td><td class="r">${r.sackSize} ${r.unit}</td><td class="r" style="font-weight:700">${r.final} ${r.unit}</td><td class="r" style="font-weight:700;color:#1c69d4">${r.karung} karung</td></tr>`
  ).join('')
  const html = `<!DOCTYPE html><html><head><title>Bon ${date}</title>
  <style>
    body{font-family:Arial,sans-serif;font-size:11px;padding:16px;background:#fff;color:#000}
    h2{font-size:14px;margin-bottom:2px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
    .stripe{height:4px;background:linear-gradient(to right,#0066b1 0%,#0066b1 33%,#1c69d4 33%,#1c69d4 66%,#e22718 66%,#e22718 100%);margin-bottom:10px}
    .info{color:#555;margin-bottom:10px;font-size:10px}
    table{width:100%;border-collapse:collapse}
    th{background:#000;color:#fff;padding:7px 8px;text-align:left;font-size:9px;letter-spacing:1.5px;text-transform:uppercase}
    td{padding:7px 8px;border-bottom:1px solid #e0e0e0}
    .r{text-align:right}
    .note{margin-top:8px;font-size:10px;color:#999}
    .sig{margin-top:28px;display:flex;gap:60px}
    .sig div{border-top:1px solid #333;padding-top:4px;width:110px;font-size:10px;letter-spacing:1px;text-transform:uppercase}
  </style></head><body>
  <div class="stripe"></div>
  <h2>Bon Material Produksi — PT TMMIN Casting Division</h2>
  <div class="info">Tanggal: <strong>${date}</strong> &nbsp;|&nbsp; ${info}</div>
  <table><thead><tr><th>Material</th><th>Produk</th><th class="r">Total Tepat</th><th class="r">Uk. Karung</th><th class="r">Bon Final</th><th class="r">Karung</th></tr></thead>
  <tbody>${tRows}</tbody></table>
  <div class="note">* Bon Final dibulatkan ke karung penuh.</div>
  <div class="sig"><div>Dibuat oleh</div><div>Supervisor</div><div>Disetujui</div></div>
  </body></html>`
  const w = window.open('', '_blank')
  w.document.write(html)
  w.document.close()
  w.print()
}

const TH_STYLE = {
  fontFamily: "'Bricolage Grotesque', sans-serif",
  fontSize: '9px', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase',
  color: '#7e7e7e',
  padding: '10px 12px',
  borderBottom: '1px solid #3c3c3c',
  whiteSpace: 'nowrap',
}

export default function Calculator({ settings, onAddHistory }) {
  const today = new Date().toISOString().split('T')[0]
  const [inputs, setInputs] = useState({ '2tr': '', '1tr': '', kai: '', crank: '' })
  const [date, setDate] = useState(today)
  const [bon, setBon] = useState(null)
  const [saved, setSaved] = useState(false)

  const setInput = (p, v) => setInputs(prev => ({ ...prev, [p]: v }))
  const ratio = settings.ratio || 3

  const handleCalc = () => {
    const result = buildBon(inputs, settings)
    setBon(result)
    setSaved(false)
  }

  const handleReset = () => {
    setInputs({ '2tr': '', '1tr': '', kai: '', crank: '' })
    setBon(null)
    setSaved(false)
  }

  const handleSave = () => {
    if (!bon || saved) return
    onAddHistory({ id: Date.now(), date, ...bon })
    setSaved(true)
  }

  return (
    <div>
      {/* Info bar + date */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex-1 min-w-[200px] bg-bg2 px-4 py-2.5 text-text2" style={{
          border: '1px solid #3c3c3c',
          borderLeft: '3px solid #1c69d4',
          borderRadius: 0,
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '11px', fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          Input lot kecil · konversi ke lot besar otomatis (÷&nbsp;
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#ffffff' }}>{ratio}</span>)
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="field-label" style={{ marginBottom: 0 }}>Tanggal</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="input-base"
            style={{ width: 'auto' }}
          />
        </div>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {PRODS.map(p => {
          const v = parseFloat(inputs[p]) || 0
          const lb = toLB(v, ratio)
          return (
            <div key={p} className={`metric-card ${ACCENT_CLS[p]} text-center`}>
              <div className="mb-3">
                <span className={`tag ${TAG_CLASS[p]}`}>{PROD_LABELS[p]}</span>
              </div>
              <div className="field-label" style={{ marginBottom: '6px' }}>lot kecil</div>
              <input
                type="number"
                min="0"
                value={inputs[p]}
                placeholder="0"
                onChange={e => setInput(p, e.target.value)}
                className="w-full text-center focus:outline-none transition-all"
                style={{
                  background: '#262626',
                  border: '1px solid #3c3c3c',
                  borderRadius: 0,
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '32px',
                  fontWeight: 500,
                  color: '#ffffff',
                  padding: '8px 4px',
                  letterSpacing: '-1px',
                }}
                onFocus={e => e.target.style.borderColor = '#ffffff'}
                onBlur={e => e.target.style.borderColor = '#3c3c3c'}
              />
              <div style={{ height: '1px', background: '#3c3c3c', margin: '12px 0' }} />
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#7e7e7e', letterSpacing: '0.5px' }}>
                = <strong style={{ color: ACCENT_COLOR[p], fontSize: '20px', fontWeight: 700 }}>{lb}</strong>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginLeft: '4px' }}>lot besar</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button className="btn btn-primary" onClick={handleCalc}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
          </svg>
          Hitung
        </button>
        <button className="btn" onClick={handleReset}>Reset</button>
      </div>

      {/* Bon result */}
      {bon && (
        <div className="card" style={{ padding: 0 }}>
          {/* Card header */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4" style={{ borderBottom: '1px solid #3c3c3c' }}>
            <div className="section-title flex-1 min-w-[120px]">Detail Bon Material</div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-success" onClick={handleSave} disabled={saved}>
                {saved ? '✓ Tersimpan' : (
                  <>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Simpan
                  </>
                )}
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => printBon(bon, date)}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Cetak PDF
              </button>
            </div>
          </div>

          {/* Lot summary */}
          <div className="flex flex-wrap gap-2 items-center px-5 py-3" style={{ borderBottom: '1px solid #3c3c3c' }}>
            <strong style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#ffffff', letterSpacing: '0.5px' }}>{date}</strong>
            {PRODS.filter(p => bon.lots[p].kecil > 0).map(p => (
              <span key={p} className="chip">
                <span className={`tag ${TAG_CLASS[p]} mr-1.5`} style={{ fontSize: '9px' }}>{PROD_LABELS[p]}</span>
                {bon.lots[p].kecil}→{bon.lots[p].besar}lb
              </span>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '520px' }}>
              <thead>
                <tr style={{ background: '#0d0d0d' }}>
                  {['Material','Produk','Total Tepat','Uk. Karung','Bon Final','Karung'].map((h, i) => (
                    <th key={h} style={{ ...TH_STYLE, textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bon.rows.map((r, idx) => (
                  <tr key={r.name} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #3c3c3c', fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: '13px', color: '#ffffff', letterSpacing: '0.5px' }}>{r.name}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #3c3c3c' }}>
                      {r.produks.map(prod => <ProdTag key={prod} prod={prod} />)}
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #3c3c3c', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#bbbbbb', whiteSpace: 'nowrap' }}>{r.exactTotal} {r.unit}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #3c3c3c', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#7e7e7e', whiteSpace: 'nowrap' }}>{r.sackSize} {r.unit}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #3c3c3c', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#1c69d4', whiteSpace: 'nowrap' }}>{r.final} {r.unit}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #3c3c3c', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap' }}>
                      {r.karung}
                      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', color: '#7e7e7e', marginLeft: '4px', textTransform: 'uppercase' }}>krg</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ padding: '10px 20px 14px', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7e7e7e' }}>
            * Bon Final dibulatkan ke karung penuh · Material gabungan dari beberapa produk sudah diakumulasi
          </p>
        </div>
      )}
    </div>
  )
}
