/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores extraídos del mockup (aproximados)
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Color principal de botones e iconos activos
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        dark: {
          DEFAULT: '#0f172a', // Fondo del sidebar y panel derecho login (Slate 900)
          paper: '#1e293b',   // Posible fondo secundario oscuro
        },
        success: {
          DEFAULT: '#10b981', // Verde ingresos
          light: '#d1fae5',   // Fondo verde claro
        },
        danger: {
          DEFAULT: '#ef4444', // Rojo gastos
          light: '#fee2e2',   // Fondo rojo claro
        },
        warning: {
          DEFAULT: '#f59e0b', // Naranja alertas
          light: '#fef3c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Fuente estándar moderna
      }
    },
  },
  plugins: [],
}
