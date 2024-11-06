import { stopPropagation } from '@/utils'

export function useClick() {
  return {
    mounted(el: HTMLElement, binding: any) {
      el.addEventListener('pointerdown', e => {
        stopPropagation(e)
        el.addEventListener('pointerup', e => {
          stopPropagation(e)
          binding.value?.(e)
        })
      })
    },
    unmounted(el: HTMLElement) {
      el = null
    }
  }
}
