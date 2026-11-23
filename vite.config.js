import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { importScripts: ['push-sw.js'] }, // recebe os lembretes (public/push-sw.js)
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: "Lezoro'a",
        short_name: "Lezoro'a",
        description: 'Cultive sua fé, um dia de cada vez.',
        lang: 'pt-BR',
        theme_color: '#10288C',
        background_color: '#10288C',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
