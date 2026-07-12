import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools';
// @ts-ignore
import redefineConsole from './redefine-console-plugin.js';
import { multiPagePlugin } from './vite.config.multipage.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      redefineConsole(),
      multiPagePlugin,
    ],
    define: {
      // 将环境变量注入到客户端代码中
      __VITE_API_HOST__: JSON.stringify(env.VITE_API_HOST || ''),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "http://localhost:8787",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api")
        }
      }
    },
    publicDir: 'public',  //编译时将public一起编译
    build: {
      rollupOptions: {
        output: {
          manualChunks: function (id) {
            if (id.includes("node_modules") && (id.endsWith(".js") || id.endsWith(".ts"))) {
              return "vendor";
            }
          }
        }
      },
      // 移除生产环境中的 console 语句
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.warn', 'console.error', 'console.debug', 'console.trace']
        },
        mangle: true,
        format: {
          comments: false
        }
      },
      minify: 'terser'
    },
  }
})
