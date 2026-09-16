import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // WAJIB 5173 atau 5174, sesuai origin yang diizinkan CORS backend
    strictPort: true,
  },
});
