import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'sentinel_icon.png'],
            manifest: {
                name: 'Europe 2026 Sentinel',
                short_name: 'Sentinel',
                description: 'Autonomous Travel Control Center for Europe 2026.',
                theme_color: '#0f172a',
                icons: [
                    {
                        src: 'sentinel_icon.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
})
