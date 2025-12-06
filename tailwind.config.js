/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
    './index.html'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Brand Colors (Neutrals / Slate)
        brand: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617'
        },
        // Accent Colors (Action Blue)
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#DBEAFE',
          dark: '#1E40AF',
          foreground: '#FFFFFF'
        },
        // Functional Colors
        success: {
          DEFAULT: '#059669',
          light: '#D1FAE5',
          dark: '#059669', // Using text color as dark for consistency in badges
          text: '#059669'
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
          dark: '#D97706',
          text: '#D97706'
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
          dark: '#DC2626',
          text: '#DC2626'
        },
        info: {
          DEFAULT: '#0284C7',
          light: '#E0F2FE',
          dark: '#0284C7',
          text: '#0284C7'
        },
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#2563EB',
        background: '#F8FAFC',
        foreground: '#0F172A',
        primary: {
          DEFAULT: '#0F172A',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          foreground: '#334155'
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF'
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A'
        }
      },
      borderRadius: {
        lg: '6px',
        md: '6px',
        DEFAULT: '4px',
        sm: '2px',
        none: '0px'
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace']
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.4' }],
        'sm': ['13px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'lg': ['16px', { lineHeight: '1.5' }],
        'xl': ['18px', { lineHeight: '1.4' }],
        '2xl': ['20px', { lineHeight: '1.3' }],
        '3xl': ['24px', { lineHeight: '1.2' }],
        '4xl': ['30px', { lineHeight: '1.1' }]
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' }
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
