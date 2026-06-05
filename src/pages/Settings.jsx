import { useState, useEffect } from 'react'
import { PRODS, PROD_LABELS, TAG_CLASS, DEF } from '../data/defaults.js'

function clone(o) { return JSON.parse(JSON.stringify(o)) }

function getAllMatNames(s) {
  const set = new Set()
  PRODS.forEach(p => s[p].forEach(m => set.add(m.name)))
  return [...set]
}

const LABEL = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: '9px', fontWeight: 700,
  letterSpacing: '2px', textTransform: 'uppercase',
  color: '#7e7e7e',
}

export default function Settings({ settings, onSave, onReset }) {
  const [local, setLocal] = useState(clone(settings))
  const [saved, setSaved] = useState(false)

  useEffect(() => { setLocal(clone(settings)) }, [settings])

  const setRatio = v => setLocal(prev => ({ ...prev, ratio: parseInt(v) || 3 }))

  const setMatValue = (prod, i, v) =>
    setLocal(prev => {
      const next = clone(prev)
      const num = parseFloat(v)
      if (!isNaN(num)) next[prod][i].perLot = num
      return next
    })

  const setSackValue = (name, v) =>
    setLocal(prev => {
      const next = clone(prev)
      next.sacks[name] = parseFloat(v) || 10
      return next
    })

  const handleSave = () => {
    onSave(clone(local))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (!confirm('Reset semua pengaturan ke default?')) return
    onReset()
    setLocal(clone(DEF))
  }

  const matNames = getAllMatNames(local)

  return (
    <div>
      {/* Info notice */}
      <div className="mb-5 px-4 py-3" style={{
        background: '#1a1a1a',
        border: '1px solid #3c3c3c',
        borderLeft: '3px solid #1c69d4',
        borderRadius: 0,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '11px', fontWeight: 700,
        letterSpacing: '1px', textTransform: 'uppercase',
        color: '#bbbbbb',
      }}>
        Semua perubahan tersimpan di browser · Nilai adalah kebutuhan per <span style={{ color: '#ffffff' }}>lot besar</span>
      </div>

      {/* Konversi lot */}
      <div className="card mb-4">
        <div style={{ ...LABEL, marginBottom: '16px' }}>Konversi Lot</div>
        <div className="flex items-end gap-5 flex-wrap">
          <div>
            <div className="field-label">Lot Kecil per 1 Lot Besar</div>
            <input
              type="number"
              min="1"
              value={local.ratio}
              onChange={e => setRatio(e.target.value)}
              className="input-base text-center"
              style={{ width: '90px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '20px', fontWeight: 500 }}
            />
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#7e7e7e', paddingBottom: '2px' }}>
            contoh: {local.ratio} lot kecil = 1 lot besar = 1 penuangan
          </div>
        </div>
      </div>

      {/* Material per produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {PRODS.map(prod => (
          <div key={prod} className="card" style={{ padding: 0 }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid #3c3c3c' }}>
              <span className={`tag ${TAG_CLASS[prod]}`}>{PROD_LABELS[prod]}</span>
              <span style={LABEL}>per lot besar</span>
            </div>
            <div>
              {local[prod].map((m, i) => (
                <div key={m.name} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < local[prod].length - 1 ? '1px solid #262626' : 'none' }}>
                  <span style={{ flex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: '#bbbbbb', letterSpacing: '0.5px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={m.perLot}
                    onChange={e => setMatValue(prod, i, e.target.value)}
                    className="input-base text-right"
                    style={{ width: '70px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px' }}
                  />
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7e7e7e', minWidth: '56px' }}>
                    {m.unit}/lot
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ukuran karung */}
      <div className="card mb-5" style={{ padding: 0 }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #3c3c3c' }}>
          <span style={LABEL}>Ukuran Karung per Material</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: '#7e7e7e', letterSpacing: '0.5px' }}>
            Dipakai untuk pembulatan ke karung penuh
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {matNames.map((name, i) => (
            <div key={name} className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #262626', borderRight: i % 2 === 0 ? '1px solid #262626' : 'none' }}>
              <span style={{ flex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', color: '#bbbbbb', letterSpacing: '0.5px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
              <input
                type="number"
                min="1"
                value={local.sacks[name] ?? 10}
                onChange={e => setSackValue(name, e.target.value)}
                className="input-base text-right"
                style={{ width: '70px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px' }}
              />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7e7e7e', minWidth: '60px' }}>
                kg/karung
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Save / reset */}
      <div className="flex gap-2 items-center flex-wrap">
        <button className="btn btn-primary" onClick={handleSave}>Simpan Pengaturan</button>
        <button className="btn" onClick={handleReset}>Reset Default</button>
        {saved && (
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0fa336' }}>
            ✓ Tersimpan
          </span>
        )}
      </div>
    </div>
  )
}
