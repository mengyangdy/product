import { nextTick } from 'vue'

import { _css } from './dom'
import { SlideType } from './const_var'
import bus from './bus'

import { stopPropagation } from './index'

/**
 * 检查并标准化触摸/指针事件
 *
 * @param e - 事件对象(TouchEvent 或 PointerEvent)
 * @returns {boolean} - 始终返回 true
 *
 *   该函数主要用于：
 *
 *   1. 检测设备类型（移动端/桌面端）
 *   2. 统一事件对象格式，确保 e.touches 属性的存在
 *   3. 在非移动设备或使用 PointerEvent 时，将鼠标/指针坐标转换为类似触摸事件的格式
 */
function checkEvent(e: any) {
  // 通过 UA 判断是否为移动设备
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent)

  // 如果是非移动设备，或者是移动设备但使用 PointerEvent
  // 则需要模拟 touches 数组格式
  if (!isMobile || (isMobile && e instanceof PointerEvent)) {
    e.touches = [
      {
        clientX: e.clientX, // 相对于视口的 X 坐标
        clientY: e.clientY, // 相对于视口的 Y 坐标
        pageX: e.pageX, // 相对于文档的 X 坐标
        pageY: e.pageY // 相对于文档的 Y 坐标
      }
    ]
  }
  return true
}

// 初始化信息，获取slide dom的长宽、子元素数量，用于move事件判断能否滑动
export function slideInit(el: any, state: any) {
  state.wrapper.width = _css(el, 'width')
  state.wrapper.height = _css(el, 'height')
  nextTick(() => {
    state.wrapper.childrenLength = el.children.length
  })

  const t = getSlideOffset(state, el)

  let dx1 = 0
  let dx2 = 0
  if (state.type === SlideType.HORIZONTAL) {
    dx1 = t
  } else {
    dx2 = t
  }
  _css(el, 'transform', `translate3d(${dx1}px,${dx2}px,0)`)
}

/**
 * 检测在对应方向上能否允许滑动，比如SlideHorizontal组件就只处理左右滑动事件，SlideVertical只处理上下滑动事件
 *
 * - @param state
 *
 * @returns {boolean}
 */
export function canSlide(state: any) {
  // 每次按下都需要检测，up事件会重置为true
  if (state.needCheck) {
    // 判断move x和y的距离是否大于判断值，因为距离太小无法判断滑动方向
    if (
      Math.abs(state.move.x) > state.judgeValue ||
      Math.abs(state.move.y) > state.judgeValue
    ) {
      // 放大再相除，根据长宽比判断方向，angle大于1就是左右滑动，小于是上下滑动
      const angle =
        (Math.abs(state.move.x) * 10) / (Math.abs(state.move.y) * 10)
      // 根据当前slide的类型，判断能否滑动，并记录下来，后续不再判断，直接返回记录值
      state.next = state.type === SlideType.HORIZONTAL ? angle > 1 : angle <= 1
      // console.log('angle', angle, state.next)
      state.needCheck = false
    } else {
      return false
    }
  }
  return state.next
}

export function canNext(state: any, isNext: boolean) {
  return !(
    (state.localIndex === 0 && !isNext) ||
    (state.localIndex === state.wrapper.childrenLength - 1 && isNext)
  )
}

export function slideTouchStart(e: any, el: any, state: any) {
  if (!checkEvent(e)) return
  _css(el, 'transition-duration', '0ms')
  // 记录起点坐标，用于move事件计算移动距离
  state.start.x = e.touches[0].pageX
  state.start.y = e.touches[0].pageY
  // 记录按下时间，用于up事件判断滑动时间
  state.start.time = Date.now()
  state.isDown = true
}

export function slideTouchMove(
  e: any,
  el: any,
  state: any,
  canNextCb: any = null,
  notNextCb: any = null,
  slideOtherDirectionCb: any = null
) {
  if (!checkEvent(e)) return
  if (!state.isDown) return
  // 计算移动距离
  state.move.x = e.touches[0].pageX - state.start.x
  state.move.y = e.touches[0].pageY - state.start.y
  // 检测能否滑动
  const canSlideRes = canSlide(state)
  // 是否在往到头或尾滑动
  const isNext =
    state.type === SlideType.HORIZONTAL ? state.move.x < 0 : state.move.y < 0

  if (state.type === SlideType.VERTICAL_INFINITE) {
    if (canSlideRes && state.localIndex === 0 && !isNext) {
      bus.emit(`${state.name}-moveY`, state.move.y)
    }
  }

  if (canSlideRes) {
    if (!canNextCb) canNextCb = canNext
    if (canNextCb(state, isNext)) {
      window.isMoved = true
      stopPropagation(e)
      if (state.type === SlideType.HORIZONTAL) {
        bus.emit(`${state.name}-moveX`, state.move.x)
      }

      const t =
        getSlideOffset(state, el) +
        (isNext ? state.judgeValue : -state.judgeValue)
      let dx1 = 0
      let dx2 = 0
      if (state.type === SlideType.HORIZONTAL) {
        dx1 = t + state.move.x
      } else {
        dx2 = t + state.move.y
      }

      _css(el, 'transition-duration', `0ms`)
      _css(el, 'transform', `translate3d(${dx1}px,${dx2}px,0)`)
    } else {
      notNextCb?.()
    }
  } else {
    slideOtherDirectionCb?.(e)
  }
}

export function slideTouchEnd(
  e: any,
  state: any,
  canNextCb: any = null,
  nextCb: any = null,
  notNextCb: any = null
) {
  if (!checkEvent(e)) {
    return
  }
  if (!state.isDown) {
    return
  }

  if (state.next) {
    const isHorizontal = state.type === SlideType.HORIZONTAL

    const isNext = isHorizontal ? state.move.x < 0 : state.move.y < 0
    if (!canNextCb) canNextCb = canNext

    if (canNextCb(state, isNext)) {
      const endTime = Date.now()
      let gapTime = endTime - state.start.time

      const distance = isHorizontal ? state.move.x : state.move.y
      const judgeValue = isHorizontal
        ? state.wrapper.width
        : state.wrapper.height
      if (Math.abs(distance) < 20) gapTime = 1000
      if (Math.abs(distance) > judgeValue / 3) gapTime = 100
      if (gapTime < 150) {
        if (isNext) {
          state.localIndex++
        } else {
          state.localIndex--
        }
        return nextCb?.(isNext)
      }
    } else {
      return notNextCb?.()
    }
  } else {
    notNextCb?.()
  }
}

export function slideReset(e: any, el: any, state: any, emit: any = null) {
  if (!checkEvent(e)) return
  _css(el, 'transition-duration', '300ms')
  const t = getSlideOffset(state, el)
  let dx1 = 0
  let dx2 = 0

  if (state.type === SlideType.HORIZONTAL) {
    bus.emit(`${state.name}-end`, state.localIndex)
    dx1 = t
  } else {
    bus.emit(`${state.name}-end`)
    dx2 = t
  }
  _css(el, 'transform', `translate3d(${dx1}px,${dx2}px,0)`)
  state.start.x =
    state.start.y =
    state.start.time =
    state.move.x =
    state.move.y =
      0
  state.next = false
  state.needCheck = true
  state.isDown = false
  setTimeout(() => {
    window.isMoved = false
  }, 200)
  emit?.('update:index', state.localIndex)
}

export function getSlideOffset(state: any, el: HTMLDivElement) {
  if (state.type === SlideType.HORIZONTAL) {
    let widths: any[] = []
    Array.from(el.children).map(v => {
      widths.push(v.getBoundingClientRect().width)
    })

    widths = widths.slice(0, state.localIndex)
    if (widths.length) {
      return -widths.reduce((a, b) => a + b)
    }
    return 0
  }
  if (state.type === SlideType.VERTICAL_INFINITE) {
    return -state.localIndex * state.wrapper.height
  }
  let heights: any[] = []
  Array.from(el.children).map(v => {
    heights.push(v.getBoundingClientRect().height)
  })
  heights = heights.slice(0, state.localIndex)
  if (heights.length) return -heights.reduce((a, b) => a + b)
  return 0
}
