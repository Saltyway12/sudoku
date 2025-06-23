import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sudoku/', // Nom de votre repository
  build: {
    outDir: 'dist'
  }
})