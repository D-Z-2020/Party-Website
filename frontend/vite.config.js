import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
      less: {
        math: 'parens-division',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 路径别名
    }
  },
  // server:{
  //   hmr:true, //开启热更新
  // },
})
