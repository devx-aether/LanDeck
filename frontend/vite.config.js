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
        description: 'Home Server Control Center',
        theme_color: '#090a0f',
        background_color: '#090a0f',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/814/814467.png', // Fallback standard icon
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/814/814467.png', // Fallback standard icon
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})