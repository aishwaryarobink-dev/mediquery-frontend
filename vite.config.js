import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // This tells Vite that @ means the src folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  // If you want variables available everywhere without importing:
  css: {
    preprocessorOptions: {
      scss: {
        // Optional: this auto-imports variables into every scss file
        // additionalData: `@use "@/variables" as *;` 
      },
    },
  },
})