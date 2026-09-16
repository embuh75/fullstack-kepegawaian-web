/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bfd3fe",
          300: "#93b4fd",
          400: "#608bfa",
          500: "#3b66f5",
          600: "#2547e9",
          700: "#1f38d1",
          800: "#2030a8",
          900: "#1f2d84",
          950: "#161b52",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgb(15 23 42 / 0.08), 0 4px 24px -4px rgb(15 23 42 / 0.06)",
      },
    },
  },
  plugins: [],
};
