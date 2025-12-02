/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#000000',
          secondary: '#B5A692',
          accent: '#F5F5F5',
        },
        text: {
          primary: '#000000',
          secondary: '#666666',
          muted: '#999999',
        },
        background: {
          main: '#FFFFFF',
          secondary: '#F5F5F5',
          dark: '#000000',
        },
        border: '#E5E5E5',
      },
      fontFamily: {
        heading: ['Lora', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}