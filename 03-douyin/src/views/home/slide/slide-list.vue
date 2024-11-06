<template>
  <SlideVerticalInfinite
    :id="props.uniqueId"
    ref="listRef"
    v-model:index="state.index"
    v-love="props.uniqueId"
    :unique-id="props.uniqueId"
    name="infinite"
    :active="props.active"
    :loadding="baseStore.loading"
    :render="render"
    :list="state.list"
    @load-more="loadMore"
    @refresh="() => getData(true)"
  />
</template>

<script setup lang="tsx">
import { onMounted, onUnmounted, reactive, ref } from 'vue'

import SlideVerticalInfinite from '@/components/slide/slide-vertical-infinite.vue'
import { useMainStore } from '@/store'
import bus, { EVENT_KEY } from '@/utils/bus.ts'
import SlideUser from '@/components/slide/slide-user.vue'
import BaseVideo from '@/components/slide/base-video.vue'

const props = defineProps({
  cbs: {
    type: Object,
    default() {
      return {}
    }
  },
  active: {
    type: Boolean,
    default: false
  },
  api: {
    type: Function,
    default: void 0
  },
  index: {
    type: Number,
    default: 0
  },
  list: {
    type: Array,
    default() {
      return []
    }
  },
  uniqueId: {
    type: String,
    default() {
      return 'uniqueId1'
    }
  }
})

const baseStore = useMainStore()

const p = {
  onShowComments() {}
}

const render = slideItemRender({ ...props.cbs, ...p })

function slideItemRender(params: any) {
  return (item: any, index: any, play: boolean, uniqueId: string) => {
    let node
    switch (item.type) {
      case 'img':
        node = (
          <img
            src={item.src}
            style="height:100%;"
            alt={''}
          />
        )
        break
      case 'user':
        node = <SlideUser {...params} />
        break
      case 'send-video':
        node = (
          <video
            src={item.src}
            style="height:100%;"
          />
        )
        break
      default:
        node = (
          <BaseVideo
            isPlay={play}
            item={item}
            index={index}
            position={{ uniqueId, index }}
            {...params}
          />
        )
        break
    }
    return node
  }
}

const listRef = ref(null)
const state = reactive({
  index: props.index,
  list: props.list,
  totalSize: 0,
  pageSize: 10
})

function loadMore() {
  if (!baseStore.loading) {
    getData()
  }
}
function click(uniqueId) {
  if (!props.active) return
  if (uniqueId !== props.uniqueId) return
  bus.emit(EVENT_KEY.SINGLE_CLICK_BROADCAST, {
    uniqueId,
    index: state.index,
    type: EVENT_KEY.ITEM_TOGGLE
  })
}

async function getData(refresh = false) {
  if (!refresh && state.totalSize === state.list.length) return
  if (baseStore.loading) return
  baseStore.loading = true
  const res = await props.api({
    start: refresh ? 0 : state.list.length,
    pageSize: state.pageSize
  })
  baseStore.loading = false
  if (res.success) {
    state.totalSize = res.data.total
    if (refresh) {
      state.list = []
    }
    state.list = state.list.concat(res.data.list)
  }
}

function updateItem({ position, item }) {
  if (position.uniqueId === props.uniqueId) {
    state.list[position.index] = item
  }
}

function togglePlay() {
  if (!props.active) return
  bus.emit(EVENT_KEY.SINGLE_CLICK_BROADCAST, {
    uniqueId: props.uniqueId,
    index: state.index,
    type: EVENT_KEY.ITEM_TOGGLE
  })
}

onMounted(() => {
  bus.on(EVENT_KEY.SINGLE_CLICK, click)
  bus.on(EVENT_KEY.UPDATE_ITEM, updateItem)
  bus.on(EVENT_KEY.TOGGLE_CURRENT_VIDEO, togglePlay)
})
onUnmounted(() => {
  bus.off(EVENT_KEY.SINGLE_CLICK, click)
  bus.off(EVENT_KEY.UPDATE_ITEM, updateItem)
  bus.off(EVENT_KEY.TOGGLE_CURRENT_VIDEO, togglePlay)
})
</script>

<style scoped lang="less"></style>
