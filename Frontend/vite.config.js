import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // Expose to all interfaces (required for EC2)
    port: 5173,          // Or any custom open port
    strictPort: true,    // Fail if port is already in use
  },
})