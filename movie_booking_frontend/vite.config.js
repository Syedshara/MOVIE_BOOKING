import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/movie_booking_backend': {
        target: 'http://localhost:8080', // backend API URL
        changeOrigin: true,  // this ensures the origin of the request is updated to match the backend
        rewrite: (path) => path.replace(/^\/movie_booking_backend/, ''), // remove the /movie_booking_backend prefix before forwarding
      },
    },
  },
})
