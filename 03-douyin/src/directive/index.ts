import type { App } from 'vue'

import Love from '@/directive/love.ts'

import Hide from './hide.ts'

export function setupDirective(app: App) {
  app.directive('hide', Hide)
  app.directive('love', Love)
}
