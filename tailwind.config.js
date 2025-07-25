/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest': '#2D5016',
        'leaf': '#7CB342',
        'harvest': '#FFA726',
        'sage': '#F5F7F0',
        'success': '#43A047',
        'warning': '#FB8C00',
        'error': '#E53935',
        'info': '#1976D2'
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}