import { random } from '@/utils'
import Dom from '@/utils/dom.ts'
import bus, { EVENT_KEY } from '@/utils/bus.ts'

const Love = {
  // 在元素被插入到 DOM 前调用
  mounted(el, binding) {
    let isDbClick = false
    let clickTimer = null
    let dbClickTimer = null
    let lastClickTime = null
    let isDown = false
    let isMove = false
    const checkTime = 200
    const dbCheckCancelTime = 500
    const dbClick = e => {
      const id = `a${Date.now()}`
      const elWidth = 80
      const rotate = random(0, 1)
      const template = `<img class="${rotate ? 'left love-dbclick' : 'right love-dbclick'}" id="${id}" src="${new URL('../assets/img/icon/loved.svg', import.meta.url).href}">`
      const el = new Dom().create(template)
      el.css({ top: e.y - elWidth - 40, left: e.x - elWidth / 2 })
      new Dom(`#${binding.value}`).append(el)
      setTimeout(() => {
        new Dom(`#${id}`).remove()
      }, 1000)
    }
    const check = e => {
      if (isDbClick) {
        clearTimeout(dbClickTimer)
        dbClick(e)
        dbClickTimer = setTimeout(() => (isDbClick = false), dbCheckCancelTime)
        return
      }
      const nowTime = new Date().getTime()
      if (nowTime - lastClickTime < checkTime) {
        clearTimeout(clickTimer)
        dbClick(e)
        isDbClick = true
        dbClickTimer = setTimeout(() => (isDbClick = false), dbCheckCancelTime)
      } else {
        clickTimer = setTimeout(() => {
          bus.emit(EVENT_KEY.SINGLE_CLICK, binding.value)
        }, checkTime)
      }
      lastClickTime = nowTime
    }
    const up = e => {
      if (!isDown) return
      if (!isMove && !window.isMoved) check(e)
      isMove = false
      isDown = false
    }
    el.addEventListener('pointerdown', () => (isDown = true))
    el.addEventListener('pointermove', () => isDown && (isMove = true))
    el.addEventListener('pointerup', up)
  }
}

export default Love
