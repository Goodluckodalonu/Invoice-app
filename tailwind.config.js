/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7C5DFA',
        'primary-light': '#9277FF',
        danger: '#EC5757',
        'danger-light': '#FF9797',
        // Dark theme
        'dark-bg': 'var(--color-bg)',
        'dark-card': 'var(--color-card)',
        'dark-input': 'var(--color-input)',
        'dark-sidebar': 'var(--color-sidebar)',
        // Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        // Status
        'status-paid': '#33D69F',
        'status-paid-bg': 'rgba(51, 214, 159, 0.06)',
        'status-pending': '#FF8F00',
        'status-pending-bg': 'rgba(255, 143, 0, 0.06)',
        'status-draft-text': 'var(--color-draft-text)',
        'status-draft-bg': 'var(--color-draft-bg)',
      },
      fontFamily: {
        spartan: ['"League Spartan"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}