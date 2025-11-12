/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'light-bg': '#FFFFFF',
        'light-sidebar': '#F7F7F8',
        'light-user-bubble': '#007AFF',
        'light-ai-bubble': '#E9ECEF',
        'light-text': '#000000',
        'light-text-secondary': '#666666',
        'light-border': '#E5E5EA',

        // Dark theme colors
        'dark-bg': '#0E0E0E',
        'dark-sidebar': '#1C1C1E',
        'dark-user-bubble': '#0A84FF',
        'dark-ai-bubble': '#2C2C2E',
        'dark-text': '#FFFFFF',
        'dark-text-secondary': '#8E8E93',
        'dark-border': '#3A3A3C',
      },
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        'bubble': '18px',
        'input': '24px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
