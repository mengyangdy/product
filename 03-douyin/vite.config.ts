import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(() => {
  return new Promise((resolve)=>{
    resolve({
      base:'./',
      envDir:'env',
      plugins:[
        vue()
      ],
      resolve:{
        alias:{
          '@':fileURLToPath(new URL('./src',import.meta.url))
        },
        extensions:['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
      }
    })
  })
}
)


/**
 * {
  plugins: [vue()],
}
 */