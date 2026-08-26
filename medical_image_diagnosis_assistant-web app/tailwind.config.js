/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: '#4F46E5',
          'indigo-light': '#6366F1',
          'indigo-dark': '#4338CA',
          blue: '#2563EB',
          'blue-light': '#3B82F6',
          purple: '#7C3AED',
          'purple-light': '#8B5CF6',
          teal: '#0EA5A9',
          'teal-light': '#14B8A6',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          'subsurface': '#F1F5F9',
          'subsurface-hover': '#E2E8F0',
          text: '#0F172A',
          'text-muted': '#64748B',
          'text-dim': '#94A3B8',
          border: '#E2E8F0',
          'border-subtle': '#F1F5F9',
          'border-focus': '#818CF8',
        },
        clinical: {
          success: '#10B981',
          'success-light': '#ECFDF5',
          'success-border': '#A7F3D0',
          warning: '#F59E0B',
          'warning-light': '#FFFBEB',
          'warning-border': '#FDE68A',
          error: '#EF4444',
          'error-light': '#FEF2F2',
          'error-border': '#FECACA',
          info: '#2563EB',
          'info-light': '#EFF6FF',
          'info-border': '#BFDBFE',
          // Diabetic Retinopathy stage colors
          'dr-0': '#10B981', // No DR - Emerald
          'dr-1': '#0EA5A9', // Mild - Teal
          'dr-2': '#7C3AED', // Moderate - Purple/Indigo
          'dr-3': '#F59E0B', // Severe - Amber
          'dr-4': '#EF4444', // Proliferative - Rose/Red
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        'tight-title': '-0.035em',
        'monolithic': '-0.04em',
      },
      borderRadius: {
        'bento-sm': '12px',
        'bento': '18px',
        'bento-lg': '24px',
        'bento-xl': '32px',
      },
      boxShadow: {
        'bento': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'bento-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'bento-elevated': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)',
        'bento-glow': '0 0 25px -5px rgba(79, 70, 229, 0.15)',
        'ai-glow': '0 0 30px -5px rgba(124, 58, 237, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scan-line': 'scanLine 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        scanLine: {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' },
        }
      }
    },
  },
  plugins: [],
}
