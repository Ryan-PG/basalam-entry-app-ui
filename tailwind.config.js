/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f6ff',
          100: '#ecedff',
          200: '#d9dbff',
          300: '#b8baff',
          400: '#9092ff',
          500: '#6d6df0',
          600: '#5654d6',
          700: '#4341b0',
          800: '#37368c',
          900: '#2f2e70',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#10b981',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          600: '#d97706',
          700: '#b45309',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          600: '#475569',
          700: '#334155',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(50, 50, 93, 0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
        softer: '0 8px 24px -8px rgba(50, 50, 93, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
