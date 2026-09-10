import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* base 由环境变量注入：
   本地开发留空（走 '/'），部署到 GitHub Pages 项目路径时传 VITE_BASE=/<仓库名>/ */
/* 云端托管会把服务端口通过 PORT 环境变量注入，本地开发无 PORT 时回落 5173 */
const port = process.env.PORT ? Number(process.env.PORT) : 5173;

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port,
    strictPort: true,
    allowedHosts: true,
  },
});
