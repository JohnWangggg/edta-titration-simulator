import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
// base: '/'' 适合根路径部署（Vercel / 用户页 username.github.io）
//       '/<repo>/' 适合 GitHub Pages 项目页
//       由 GitHub Actions workflow 通过 GITHUB_PAGES_BASE 环境变量注入
export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE || '/',
  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }),
    tsconfigPaths()
  ],
})