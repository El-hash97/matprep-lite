export const DEF = {
  ratio: 3,
  '2tr': [
    { name: 'LMC', unit: 'kg', perLot: 2 },
    { name: 'Inocarb', unit: 'kg', perLot: 0.5 },
    { name: 'Antimon (Sb)', unit: 'kg', perLot: 0.3 },
    { name: 'Fe Sulfur', unit: 'kg', perLot: 0.2 },
  ],
  '1tr': [
    { name: 'LMC', unit: 'kg', perLot: 2 },
    { name: 'Inocarb', unit: 'kg', perLot: 0.5 },
    { name: 'Antimon (Sb)', unit: 'kg', perLot: 0.3 },
    { name: 'Fe Sulfur', unit: 'kg', perLot: 0.2 },
  ],
  kai: [
    { name: 'Magnesium Denodule', unit: 'kg', perLot: 3 },
    { name: 'Superseed', unit: 'kg', perLot: 1 },
    { name: 'Sn (Timah)', unit: 'kg', perLot: 0.5 },
    { name: 'Cu (Tembaga)', unit: 'kg', perLot: 4 },
  ],
  crank: [
    { name: 'Magnesium Lamet', unit: 'kg', perLot: 2 },
    { name: 'Ultraseed CE Inoculant', unit: 'kg', perLot: 1 },
    { name: 'Sn (Timah)', unit: 'kg', perLot: 0.3 },
    { name: 'Cu (Tembaga)', unit: 'kg', perLot: 3 },
  ],
  sacks: {
    LMC: 20,
    Inocarb: 10,
    'Antimon (Sb)': 10,
    'Fe Sulfur': 10,
    'Magnesium Denodule': 20,
    Superseed: 10,
    'Magnesium Lamet': 20,
    'Ultraseed CE Inoculant': 10,
    'Sn (Timah)': 10,
    'Cu (Tembaga)': 20,
  },
}

export const PRODS = ['2tr', '1tr', 'kai', 'crank']
export const PROD_LABELS = { '2tr': '2TR', '1tr': '1TR', kai: 'KAI', crank: 'CRANK' }
export const TAG_CLASS = {
  '2tr': 'tag-blue',
  '1tr': 'tag-teal',
  kai:   'tag-green',
  crank: 'tag-amber',
}
export const ACCENT_CLS = {
  '2tr':  'accent-blue',
  '1tr':  'accent-teal',
  kai:    'accent-green',
  crank:  'accent-amber',
}
export const ACCENT_COLOR = {
  '2tr':  '#1c69d4',
  '1tr':  '#e22718',
  kai:    '#ffffff',
  crank:  '#0fa336',
}
export const CHART_COLORS = [
  '#1c69d4','#0066b1','#0fa336','#f4b400','#e22718','#bbbbbb','#7e7e7e','#3c3c3c',
]
