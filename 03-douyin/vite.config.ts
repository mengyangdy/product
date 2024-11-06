import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { getLastCommit } from 'git-last-commit'

// https://vite.dev/config/
export default defineConfig(() => {
  let latestCommitHash = ''
  return new Promise(resolve => {
    getLastCommit((err, commit) => {
      if (!err) {
        latestCommitHash = commit.shortHash
      }
      resolve({
        base: './',
        envDir: 'env',
        plugins: [vue(), vueJsx()],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
          },
          extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        },
        build: {
          sourcemap: false,
          rollupOptions: {
            // https://rollupjs.org/guide/en/#outputmanualchunks
            output: {
              manualChunks(id: string, { getModuleInfo }: any) {
                const reg = /(.*)\/src\/components\/(.*)/
                if (reg.test(id)) {
                  const importersLen = getModuleInfo(id)?.importers.length ?? 0
                  // 被多处引用
                  if (importersLen > 1) return 'common'
                }
                if (id.includes('node_modules')) return 'vendor'

                if (id.includes('/src/pages/home/Publish.vue')) return 'other'

                if (id.includes('/src/pages/home/Music.vue')) return 'other'
                if (id.includes('/src/pages/home/MusicRankList.vue'))
                  return 'other'
                if (id.includes('/src/pages/home/LivePage.vue')) return 'other'
                if (id.includes('/src/pages/home/SearchPage.vue'))
                  return 'other'

                if (id.includes('/src/pages/shop/Shop.vue')) return 'other'
                if (id.includes('/src/pages/shop/GoodsDetail.vue'))
                  return 'other'

                if (id.includes('/src/pages/message/Message.vue'))
                  return 'other'
                if (id.includes('/src/pages/message/Fans.vue')) return 'other'
                if (id.includes('/src/pages/message/AllMessage.vue'))
                  return 'other'
                if (id.includes('/src/pages/message/notice/DouyinHelper.vue'))
                  return 'other'
                if (id.includes('/src/pages/message/notice/SystemNotice.vue'))
                  return 'other'
                if (id.includes('/src/pages/message/notice/TaskNotice.vue'))
                  return 'other'
                if (id.includes('/src/pages/message/notice/LiveNotice.vue'))
                  return 'other'
                if (id.includes('/src/pages/message/notice/MoneyNotice.vue'))
                  return 'other'

                if (id.includes('/src/pages/me/Me.vue')) return 'other'
                if (id.includes('/src/pages/me/Visitors.vue')) return 'other'
                if (id.includes('/src/pages/me/RequestUpdate.vue'))
                  return 'other'
                if (id.includes('/src/pages/me/userinfo/EditUserInfo.vue'))
                  return 'other'
                if (id.includes('/src/pages/me/userinfo/EditUserInfoItem.vue'))
                  return 'other'
                if (id.includes('/src/pages/me/MyMusic.vue')) return 'other'

                if (id.includes('/src/pages/other/VideoDetail.vue'))
                  return 'other'
                if (id.includes('/src/pages/other/AlbumDetail.vue'))
                  return 'other'

                if (id.includes('/src/pages/people/FindAcquaintance.vue'))
                  return 'other'
                if (id.includes('/src/pages/people/FollowAndFans.vue'))
                  return 'other'
              },
              chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
              entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
              assetFileNames: 'assets/[name]-[hash].[ext]' // 资源文件像 字体，图片等
            }
          },
          assetsInlineLimit: 2048
        },
        define: {
          LATEST_COMMIT_HASH: JSON.stringify(
            latestCommitHash +
              (process.env.NODE_ENV === 'production' ? '' : ' (dev)')
          )
        },
        esbuild: {},
        server: {
          port: 3008,
          open: true,
          host: '0.0.0.0',
          fs: {
            strict: false
          }
        },
        preview: {
          port: 5555
        }
      })
    })
  })
})
