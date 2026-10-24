import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // Lets us test the PWA on our local machine
      },
      manifest: {
        name: 'LanDeck Control',
        short_name: 'LanDeck',
        theme_color: '#090a0f',
        background_color: '#090a0f',
        display: 'standalone',
        icons: [
          { src: '/vite.svg', sizes: '192x192', type: 'image/svg+xml' }
        ]
      }
    })
  ]
})