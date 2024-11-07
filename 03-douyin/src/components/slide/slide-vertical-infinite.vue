<template>
  <div class="slide slide-infinite">
    <Loading v-if="props.loading && props.list.length === 0" />
    <div
      ref="slideListEl"
      class="slide-list flex-direction-column"
      @pointerdown.prevent="touchStart"
      @pointermove.prevent="touchMove"
      @pointerup.prevent="touchEnd"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { createApp, onMounted, reactive, ref, watch } from 'vue'

import Loading from '@/components/loading.vue'
import SlideItem from '@/components/slide/slide-item.vue'
import { SlideType } from '@/utils/const_var.ts'
import { useMainStore } from '@/store'
import bus, { EVENT_KEY } from '@/utils/bus.ts'
import {
  getSlideOffset,
  slideInit,
  slideReset,
  slideTouchEnd,
  slideTouchMove,
  slideTouchStart
} from '@/utils/slide'
import { _css } from '@/utils/dom.ts'

const props = defineProps({
  index: {
    type: Number,
    default: -1
  },
  render: {
    type: Function,
    default: () => {
      return null
    }
  },
  list: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 页面中同时存在多少个slideItem
  virtualTotal: {
    type: Number,
    default: 5
  },
  name: {
    type: String,
    default: ''
  },
  uniqueId: {
    type: String,
    default: () => ''
  },
  loading: {
    type: Boolean,
    default: () => false
  },
  active: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['update:index', 'loadMore', 'refresh'])

const state = reactive({
  judgeValue: 20,
  type: SlideType.VERTICAL_INFINITE,
  name: props.name,
  localIndex: props.index,
  needCheck: true,
  next: false,
  isDown: false,
  start: { x: 0, y: 0, time: 0 },
  move: { x: 0, y: 0 },
  wrapper: { width: 0, height: 0, childrenLength: 0 }
})

const appInsMap = new Map()
const itemClassName = 'slide-item'
const slideListEl = ref<HTMLDivElement>()

const baseStore = useMainStore()

watch(
  () => props.list,
  (newV, oldV) => {
    if (newV.length <= oldV.length) {
      insertContent()
    } else if (oldV.length === 0) {
      insertContent()
    } else {
      // 走到这里，说明是通过接口加载了下一页的数据，
      // 为了在用户快速滑动时，无需频繁等待请求接口加载数据，给用户更好的使用体验
      // 这里额外加载3条数据。所以此刻，html里面有原本的5个加新增的3个，一共8个dom
      // 用户往下滑动时只删除前面多余的dom，等滑动到临界值（virtualTotal/2+1）时，再去执行新增逻辑
      // let lastSlideItem = slideListEl.value.querySelector(`.${itemClassName}:last-child`)
      // let top = _css(lastSlideItem, 'top')
      // let newListStartIndex = Number(lastSlideItem.getAttribute('data-index')) + 1
      // newVal.slice(newListStartIndex, newListStartIndex + 3).map((item, index) => {
      //   let el = getInsEl(item, newListStartIndex + index)
      //   //这里必须要设置个top值，不然会把前面的条目给覆盖掉
      //   //2022-3-27，这里不用计算，直接用已用slide-item最后一条的top值，
      //   //因为有一条情况：当滑动最后一条和二条的时候top值不会继续加。此时新增的数据如果还
      //   // 计算top值的，会和前面的对不上
      //   _css(el, 'top', top)
      //   slideListEl.value.appendChild(el)
      //   state.wrapper.childrenLength++
      // })
    }
  }
)

watch(
  () => props.index,
  newV => {
    state.localIndex = newV
    if (!props?.list?.length) return
    if (
      slideListEl.value &&
      slideListEl.value?.innerHTML &&
      state.localIndex < props?.list?.length
    ) {
      const startIndex = slideListEl.value
        .querySelector(`.${itemClassName}:first-child`)
        .getAttribute('data-index')

      const endIndex = slideListEl.value
        .querySelector(`.${itemClassName}:last-child`)
        .getAttribute('data-index')
      if (
        state.localIndex >= Number(startIndex as any) &&
        state.localIndex <= Number(endIndex as any)
      ) {
        // 在可见范围内

        touchEnd({})
      } else {
        // 不在可见范围内
        insertContent()
      }
    }
  }
)

watch(
  () => state.localIndex,
  (newV, oldV) => {
    bus.emit(EVENT_KEY.CURRENT_ITEM, props.list[newV])
    bus.emit(EVENT_KEY.SINGLE_CLICK_BROADCAST, {
      uniqueId: props.uniqueId,
      index: newV,
      type: EVENT_KEY.ITEM_PLAY
    })
    setTimeout(() => {
      bus.emit(EVENT_KEY.SINGLE_CLICK_BROADCAST, {
        uniqueId: props.uniqueId,
        index: oldV,
        type: EVENT_KEY.ITEM_STOP
      })
    }, 200)
  }
)
watch(
  () => props.active,
  newV => {
    // 当激活此页时，如果list为空，那么向上发射事件通知父组件请求数据
    if (newV && !props.list.length) return emit('refresh')
    const t = newV ? 0 : 200
    if (newV) {
      bus.emit(EVENT_KEY.CURRENT_ITEM, props.list[state.localIndex])
    }
    setTimeout(() => {
      bus.emit(EVENT_KEY.SINGLE_CLICK_BROADCAST, {
        uniqueId: props.uniqueId,
        index: state.localIndex,
        type: !newV ? EVENT_KEY.ITEM_STOP : EVENT_KEY.ITEM_PLAY
      })
    }, t)
  },
  {
    immediate: true
  }
)

onMounted(() => {
  slideInit(slideListEl.value, state)
})

function insertContent() {
  if (!props.list.length) return
  slideListEl.value.innerHTML = ''
  const half = Number.parseInt((props.virtualTotal / 2).toString(), 10)
  // 虚拟列表的一半
  // 因为我们只渲染 props.virtualTotal 条数据到dom中，并且当前index有可能不是0，所以需要计算出起始下标和结束下标
  let start = 0

  if (state.localIndex > half) {
    start = state.localIndex - half
  }
  let end = start + props.virtualTotal
  if (end >= props.list.length) {
    end = props.list.length
    start = end - props.virtualTotal
  }
  if (start < 0) {
    start = 0
  }
  props.list.slice(start, end).map((item, index) => {
    const el = getInsEl(item, start + index, start + index === state.localIndex)
    slideListEl.value.appendChild(el)
  })

  _css(
    slideListEl.value,
    'transform',
    `translate3d(0px,${getSlideOffset(state, slideListEl.value)}px,0px)`
  )

  // 因为index有可能不是0，所以要设置Item的top偏移量
  if (state.localIndex > 2 && props.list.length > 5) {
    const list = slideListEl.value.querySelectorAll(`.${itemClassName}`)
    list.forEach(item => {
      if (list.length - state.localIndex > 2) {
        _css(item, 'top', (state.localIndex - 2) * state.wrapper.height)
      } else {
        _css(item, 'top', start * state.wrapper.height)
      }
    })
  }
  state.wrapper.childrenLength = slideListEl.value.children.length
  bus.emit(EVENT_KEY.CURRENT_ITEM, props.list[state.localIndex])
}

/**
 * 获取Vue组件渲染之后的dom元素
 *
 * @param item
 * @param index
 * @param play
 */
function getInsEl(item, index, play = false) {
  const slideVNode = props.render(item, index, play, props.uniqueId)
  const parent = document.createElement('div')
  if (import.meta.env.PROD) {
    parent.classList.add('slide-item')
    parent.setAttribute('data-index', index)
    // 将Vue组件渲染到一个div上
    vueRender(slideVNode, parent)
    appInsMap.set(index, {
      unmount: () => {
        vueRender(null, parent)
        parent.remove()
      }
    })
    return parent
  }
  // 创建一个新的Vue实例，并挂载到一个div上
  try {
    const app = createApp({
      render() {
        return <SlideItem data-index={index}>{slideVNode}</SlideItem>
      }
    })
    const ins = app.mount(parent)
    appInsMap.set(index, app)
    return ins.$el
  } catch (e) {
  }
}

function touchStart(e) {
  slideTouchStart(e, slideListEl.value, state)
}

function touchMove(e) {
  slideTouchMove(e, slideListEl.value, state, canNext)
}

function touchEnd(e) {
  const isNext = state.move.y < 0
  // 如果是第一个并且是下拉并且下拉距离大于刷新距离
  if (
    state.localIndex === 0 &&
    !isNext &&
    state.move.y > baseStore.homeRefresh + baseStore.judgeValue
  ) {
    emit('refresh')
  }
  slideTouchEnd(e, state, canNext, isNext => {
    const half = Number.parseInt((props.virtualTotal / 2).toString()) // 虚拟列表的一半
    if (props.list.length > props.virtualTotal) {
      // 手指往上滑(即列表展示下一条内容)
      console.log("🚀 ~ file: slide-vertical-infinite.vue:306 ~ touchEnd ~ isNext~", isNext)

      if (isNext) {
        // 删除最前面的 `dom` ，然后在最后面添加一个 `dom`
        if (
          state.localIndex > props.list.length - props.virtualTotal &&
          state.localIndex > half
        ) {
          emit('loadMore')
        }

        if (
          state.localIndex > half &&
          state.localIndex < props.list.length - half
        ) {
          const addItemIndex = state.localIndex + half
          const res = slideListEl.value.querySelector(
            `.${itemClassName}[data-index='${addItemIndex}']`
          )
          if (!res) {
            slideListEl.value.appendChild(
              getInsEl(props.list[addItemIndex], addItemIndex)
            )
          }

          const index = slideListEl.value
            .querySelector(`.${itemClassName}:first-child`)
            .getAttribute('data-index')
          appInsMap.get(Number(index)).unmount()

          slideListEl.value
            .querySelectorAll(`.${itemClassName}`)
            .forEach(item => {
              _css(
                item,
                'top',
                (state.localIndex - half) * state.wrapper.height
              )
            })
        }
      } else {
        // 删除最后面的 `dom` ，然后在最前面添加一个 `dom`
        if (
          state.localIndex >= half &&
          state.localIndex < props.list.length - (half + 1)
        ) {
          const addIndex = state.localIndex - half
          if (addIndex >= 0) {
            const res = slideListEl.value.querySelector(
              `.${itemClassName}[data-index='${addIndex}']`
            )
            if (!res) {
              slideListEl.value.prepend(
                getInsEl(props.list[addIndex], addIndex)
              )
            }
          }
          const index = slideListEl.value
            .querySelector(`.${itemClassName}:last-child`)
            .getAttribute('data-index')
          appInsMap.get(Number(index)).unmount()

          slideListEl.value
            .querySelectorAll(`.${itemClassName}`)
            .forEach(item => {
              _css(
                item,
                'top',
                (state.localIndex - half) * state.wrapper.height
              )
            })
        }
      }
      state.wrapper.childrenLength = slideListEl.value.children.length
    }
  })
  slideReset(e, slideListEl.value, state, emit)
}

function canNext(state, isNext: boolean) {
  return !(
    (state.localIndex === 0 && !isNext) ||
    (state.localIndex === props.list.length - 1 && isNext)
  )
}

function dislike() {
  // let currentItem = $(slideListEl.value).find(`.${itemClassName}[data-index=${state.localIndex}]`)
  // let replaceItem = getInsEl(item, state.localIndex, true)
  // $(replaceItem).css('top', currentItem.css('top'))
  // currentItem.replaceWith(replaceItem)
}

defineExpose({ dislike })
</script>

<style scoped lang="less"></style>
