import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import rewriteAllPlugin from 'vite-plugin-rewrite-all'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), rewriteAllPlugin()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    server: {
        port: 5173
    }
})