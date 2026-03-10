import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './stores/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
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
        },
        secondary: {
          accent: '#f59e0b',
          success: '#10b981',
          danger: '#ef4444',
          info: '#3b82f6',
        },
        neutral: {
          bg: '#0f172a',
          surface: '#1e293b',
          surface_light: '#334155',
          text: '#f8fafc',
          text_muted: '#94a3b8',
        },
        glass: 'rgba(30, 41, 59, 0.7)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(99,102,241,0.5)',
        glass: '0 10px 30px rgba(0,0,0,0.35)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '12px',
        xl: '20px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-280px 0' },
          '100%': { backgroundPosition: '280px 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
