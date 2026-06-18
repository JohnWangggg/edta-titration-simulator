/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ink: {
          1000: '#04060D',
          950: '#070A12',
          900: '#0F1524',
          800: '#161D33',
          700: '#1F2841',
          600: '#2B3650',
        },
        led: {
          blue: '#4DD0E1',
          green: '#00E676',
          pink: '#FF2D75',
          red: '#FF5252',
          amber: '#FFB300',
        },
        indicator: {
          wine: '#B0152A',
          purple: '#7B2D8E',
          blue: '#1976D2',
          pink: '#FF2D75',
          deepblue: '#0D47A1',
        },
        textc: {
          primary: '#E8ECF4',
          secondary: '#7A8AA8',
          disabled: '#3B475C',
        },
        gridline: '#1B2236',
      },
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          '"Space Mono"',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
        sans: [
          '"IBM Plex Sans"',
          '"Inter Tight"',
          '"PingFang SC"',
          '"Noto Sans SC"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Major Mono Display"',
          '"JetBrains Mono"',
          'monospace',
        ],
      },
      boxShadow: {
        'glow-blue': '0 0 24px rgba(77,208,225,0.45)',
        'glow-pink': '0 0 24px rgba(255,45,117,0.55)',
        'glow-green': '0 0 24px rgba(0,230,118,0.55)',
        'glow-amber': '0 0 16px rgba(255,179,0,0.45)',
        'panel': '0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px -12px rgba(0,0,0,0.6)',
        'bezel': 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(122,138,168,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(122,138,168,0.06) 1px, transparent 1px)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid-32': '32px 32px',
      },
      animation: {
        'pulse-fast': 'pulse 0.6s ease-in-out infinite',
        'drop-fall': 'dropFall 320ms cubic-bezier(0.5,0,0.7,1) forwards',
        'flicker': 'flicker 80ms steps(2) 3',
        'led-blink': 'ledBlink 1.6s ease-in-out infinite',
        'scan': 'scan 2.4s linear infinite',
      },
      keyframes: {
        dropFall: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateY(40px)', opacity: '0' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        ledBlink: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 6px currentColor)' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 2px currentColor)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};