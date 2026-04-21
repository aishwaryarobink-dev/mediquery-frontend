import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // This is required for directory resolution

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // The \n at the end is the "secret sauce" to prevent syntax errors
        additionalData: `@use "@/variables" as *;\n`
      }
    }
  },
  resolve: {
    alias: {
      // This tells Vite that "@" means the "src" folder
      '@': path.resolve(__dirname, './src')
    }
  }
})