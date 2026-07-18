/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#0F172A',
          50: '#F8FAFC',
          100: '#F1F5F9',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        accent: {
          DEFAULT: '#14B8A6',
          50: '#F0FDFA',
          100: '#CCFBF1',
          600: '#14B8A6',
          700: '#0F766E',
        },
        surface: '#F8FAFC',
      },
      fontFamily: {
        cairo: ['Cairo', 'Tahoma', 'sans-serif'],
      },
      borderRadius: {
        card: '18px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 8px 28px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  plugins: [],
}
