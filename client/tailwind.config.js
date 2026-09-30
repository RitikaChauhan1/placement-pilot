/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--background)',
          surface: 'var(--surface)',
          'surface-secondary': 'var(--surface-secondary)',
          border: 'var(--border)',
          'text-primary': 'var(--text-primary)',
          'text-secondary': 'var(--text-secondary)',
          'text-muted': 'var(--text-muted)',
        },
        dark: {
          bg: '#0b0f17',
          surface: '#111827',
          'surface-subtle': '#162032',
          border: '#1f293d',
          'border-subtle': '#162032',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.95rem' }], // 11px - metadata & labels
        'xs': ['0.75rem', { lineHeight: '1.05rem' }],     // 12px - secondary & labels
        'sm': ['0.84375rem', { lineHeight: '1.25rem' }],  // 13.5px - body, nav, inputs, buttons
        'base': ['0.9375rem', { lineHeight: '1.35rem' }], // 15px - card headings
        'lg': ['1.125rem', { lineHeight: '1.5rem' }],     // 18px - section headings
        'xl': ['1.25rem', { lineHeight: '1.65rem' }],     // 20px - major section headings
        '2xl': ['1.5rem', { lineHeight: '1.9rem' }],      // 24px - page titles
        '3xl': ['1.75rem', { lineHeight: '2.15rem' }],    // 28px - hero / main page titles
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 8px 24px -8px rgba(79, 70, 229, 0.12)',
        'card': '0 2px 12px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

