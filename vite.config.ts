import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'GAINPATH',
        short_name: 'GAINPATH',
        description: 'GAINPATH Fitness PWA',
        theme_color: '#FF5722',
        background_color: '#0A0A0A',
        display: 'standalone',
        icons: [
          {
            src: 'https://placehold.co/192x192/FF5722/FFFFFF/png?text=GP',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://placehold.co/512x512/FF5722/FFFFFF/png?text=GP',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
});
