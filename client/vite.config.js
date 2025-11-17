import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      'cropperjs/dist/cropper.esm.raw.js': path.resolve(
        'node_modules/cropperjs/dist/cropper.esm.js'
      ),
    },
  },

  server: {
    host: true,
    allowedHosts: [
      "unwheedled-daryl-enactive.ngrok-free.dev"
    ]
  }
});