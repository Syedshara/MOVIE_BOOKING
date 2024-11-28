import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Bind the server to all network interfaces (0.0.0.0)
    proxy: {
      '/movie_booking_backend': {
        target: 'http://10.16.48.202:8080', // backend API URL
        changeOrigin: true,  // Ensure the origin of the request matches the backend
        rewrite: (path) => path.replace(/^\/movie_booking_backend/, ''), // Remove the prefix
      },
    },
  },
})