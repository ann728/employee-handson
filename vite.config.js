import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
//import svgr from 'vite-plugin-svgr'
import svgr from "@svgr/rollup";
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        // svgr({
        //     include: '**/*.svg',
        // }),
        svgr(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        open: true,
    },

})
