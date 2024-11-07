import { useRouter } from 'vue-router'
import { cloneDeep } from '@dylanjs/utils'

import { useMainStore } from '@/store'

export function useNav() {
  const router = useRouter()

  const store = useMainStore()

  return (path: any, query: any, data?: any) => {
    if (data) {
      store.routeData = cloneDeep(data)
    }
    router.push({ path, query })
  }
}
