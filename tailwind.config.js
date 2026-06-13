/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Bricolage Grotesque"', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        bg:       '#000000',
        bg2:      '#1a1a1a',
        bg3:      '#0d0d0d',
        bg4:      '#262626',
        hairline: '#3c3c3c',
        carbon:   '#2b2b2b',
        text1:    '#ffffff',
        text2:    '#bbbbbb',
        text3:    '#7e7e7e',
        blue:     '#1c69d4',
        teal:     '#0066b1',
        green:    '#0fa336',
        amber:    '#f4b400',
        coral:    '#e22718',
        mred:     '#e22718',
      },
    },
  },
  plugins: [],
}
