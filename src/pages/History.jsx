import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { PRODS, PROD_LABELS, TAG_CLASS, CHART_COLORS } from '../data/defaults.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function printBon(h) {
  const info = PRODS
    .filter(p => h.lots?.[p]?.kecil > 0)
    .map(p => `${PROD_LABELS[p]}: ${h.lots[p].kecil} lot kecil → ${h.lots[p].besar} lot besar`)
    .join(' | ')
  const tRows = (h.rows || []).map(r => {
    const karung = r.karung ?? (r.sackSize ? Math.ceil(+(r.exactTotal / r.sackSize).toFixed(9)) : 0)
    return `<tr><td>${r.name}</td><td>${r.produks.join(', ')}</td><td class="r">${r.exactTotal} ${r.unit}</td><td class="r">${r.sackSize} ${r.unit}</td><td class="r" style="font-weight:700">${r.final} ${r.unit}</td><td class="r" style="font-weight:700;color:#1c69d4">${karung} karung</td></tr>`
  }).join('')
  const html = `<!DOCTYPE html><html><head><title>Bon ${h.date}</title>
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
  <div class="info">Tanggal: <strong>${h.date}</strong> &nbsp;|&nbsp; ${info}</div>
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

const BAR_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a1a1a',
      borderColor: '#3c3c3c',
      borderWidth: 1,
      titleFont: { family: "'Barlow Condensed', sans-serif", size: 11, weight: 700 },
      bodyFont: { family: "'IBM Plex Mono', monospace", size: 11 },
      titleColor: '#ffffff',
      bodyColor: '#bbbbbb',
      callbacks: { label: c => `${Number(c.raw).toFixed(1)} kg` },
    },
  },
  scales: {
    x: {
      ticks: { color: '#7e7e7e', font: { family: "'Barlow Condensed', sans-serif", size: 9, weight: 700 }, maxRotation: 35 },
      grid: { color: 'rgba(255,255,255,0.03)' },
      border: { color: '#3c3c3c' },
    },
    y: {
      ticks: { color: '#7e7e7e', font: { family: "'IBM Plex Mono', monospace", size: 10 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
      border: { color: '#3c3c3c' },
    },
  },
}

function BarChart({ labels, data }) {
  if (labels.length === 0) {
    return (
      <div className="flex items-center justify-center h-[210px]" style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '2px', textTransform: 'uppercase',
        color: '#7e7e7e',
      }}>
        Belum Ada Data
      </div>
    )
  }
  return (
    <div className="relative h-[210px]">
      <Bar
        data={{
          labels,
          datasets: [{
            data,
            backgroundColor: CHART_COLORS.slice(0, labels.length),
            borderRadius: 0,
            borderSkipped: false,
          }],
        }}
        options={BAR_OPTIONS}
      />
    </div>
  )
}

const LABEL_STYLE = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: '9px', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase',
  color: '#7e7e7e',
}

export default function History({ history, onDelete, onClear }) {
  const months = [...new Set(history.map(h => h.date?.substring(0, 7)).filter(Boolean))].sort().reverse()
  const [filterMonth, setFilterMonth] = useState('')

  const currentMonth = new Date().toISOString().substring(0, 7)
  const period = filterMonth || currentMonth
  const filtered = filterMonth ? history.filter(h => h.date?.startsWith(filterMonth)) : history

  const periodData = history.filter(h => h.date?.startsWith(period))
  const totals = {}
  periodData.forEach(h => {
    if (!h.rows) return
    h.rows.forEach(r => {
      if (!totals[r.name]) totals[r.name] = { unit: r.unit, v: 0 }
      totals[r.name].v += r.final
    })
  })
  const totalKeys = Object.keys(totals)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* History list */}
      <div className="card" style={{ padding: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4" style={{ borderBottom: '1px solid #3c3c3c' }}>
          <span style={LABEL_STYLE}>Riwayat Bon</span>
          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              className="input-base"
              style={{ width: 'auto', fontSize: '11px', padding: '5px 10px' }}
            >
              <option value="">Semua</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => { if (confirm('Hapus semua riwayat?')) onClear() }}
            >
              Hapus Semua
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12" style={LABEL_STYLE}>
            Belum Ada Riwayat
          </div>
        ) : (
          <div>
            {filtered.map((h, idx) => (
              <div
                key={h.id}
                style={{
                  borderBottom: idx < filtered.length - 1 ? '1px solid #3c3c3c' : 'none',
                  padding: '14px 20px',
                  transition: 'background 120ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: '13px', fontWeight: 600, color: '#ffffff', letterSpacing: 0 }}>{h.date}</span>
                  <div className="flex gap-1.5">
                    <button className="btn btn-sm" onClick={() => printBon(h)} title="Cetak ulang">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 6 2 18 2 18 9"/>
                        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                        <rect x="6" y="14" width="12" height="8"/>
                      </svg>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => { if (confirm('Hapus record ini?')) onDelete(h.id) }}
                      title="Hapus"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PRODS.filter(p => h.lots?.[p]?.kecil > 0).map(p => (
                    <span key={p} className="chip">
                      <span className={`tag ${TAG_CLASS[p]} mr-1`} style={{ fontSize: '9px' }}>{PROD_LABELS[p]}</span>
                      {h.lots[p].kecil}→{h.lots[p].besar}lb
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recap + chart */}
      <div className="space-y-4">
        <div className="card" style={{ padding: 0 }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #3c3c3c' }}>
            <span style={LABEL_STYLE}>Rekap Pemakaian</span>
            {totalKeys.length > 0 && (
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#7e7e7e', marginLeft: '10px' }}>{period}</span>
            )}
          </div>
          {totalKeys.length === 0 ? (
            <div className="flex items-center justify-center py-10" style={LABEL_STYLE}>
              Belum Ada Data
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: '#0d0d0d' }}>
                  <th style={{ ...LABEL_STYLE, padding: '8px 20px', borderBottom: '1px solid #3c3c3c', textAlign: 'left' }}>Material</th>
                  <th style={{ ...LABEL_STYLE, padding: '8px 20px', borderBottom: '1px solid #3c3c3c', textAlign: 'right' }}>Total Bon</th>
                </tr>
              </thead>
              <tbody>
                {totalKeys.map((k, idx) => (
                  <tr key={k}>
                    <td style={{ padding: '10px 20px', borderBottom: idx < totalKeys.length - 1 ? '1px solid #3c3c3c' : 'none', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#ffffff', letterSpacing: '0.5px' }}>{k}</td>
                    <td style={{ padding: '10px 20px', borderBottom: idx < totalKeys.length - 1 ? '1px solid #3c3c3c' : 'none', textAlign: 'right', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: '12px', color: '#1c69d4' }}>{totals[k].v.toFixed(1)} {totals[k].unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="mb-4" style={LABEL_STYLE}>Material Terbanyak Dibon</div>
          <BarChart labels={totalKeys} data={totalKeys.map(k => totals[k].v)} />
        </div>
      </div>
    </div>
  )
}
