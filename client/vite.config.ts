import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { qrcode } from 'vite-plugin-qrcode'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // N'affiche le QR code que pour `npm run dev` (qrcode() sans argument se désactive au build).
    qrcode(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Matchflix',
        short_name: 'Matchflix',
        description: 'Trouvez le film parfait à deux, en swipant.',
        theme_color: '#C96F4A',
        background_color: '#FBF6F0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      // Le watcher natif de Windows échoue sur les lecteurs réseau (ex. S:) — le polling le contourne.
      usePolling: true,
    },
  },
})
