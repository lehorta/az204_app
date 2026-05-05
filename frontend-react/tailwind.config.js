/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Academia System Dark Theme (padrão)
        background: {
          primary: 'var(--color-bg-primary, #0a1929)',
          secondary: 'var(--color-bg-secondary, #0f1f2e)',
          tertiary: 'var(--color-bg-tertiary, #1a2f4a)',
          sidebar: 'var(--color-bg-sidebar, #0c1e35)',
        },
        border: {
          primary: 'var(--color-border-primary, #1e3a5f)',
          secondary: 'var(--color-border-secondary, #2d4a6f)',
          active: 'var(--color-border-active, #2196F3)',
        },
        text: {
          primary: 'var(--color-text-primary, #ffffff)',
          secondary: 'var(--color-text-secondary, #90caf9)',
          muted: 'var(--color-text-muted, #b0bec5)',
          disabled: 'var(--color-text-disabled, #546e7a)',
        },
        brand: {
          primary: 'var(--color-brand-primary, #2196F3)',
          'primary-hover': 'var(--color-brand-primary-hover, #1976D2)',
          secondary: 'var(--color-brand-secondary, #64B5F6)',
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary, linear-gradient(135deg, #1a2f4a 0%, #0a1929 100%))',
        'gradient-card': 'var(--gradient-card, linear-gradient(135deg, #0f1f2e 0%, #0a1929 100%))',
        'gradient-button': 'var(--gradient-button, linear-gradient(135deg, #2196F3 0%, #1976D2 100%))',
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
