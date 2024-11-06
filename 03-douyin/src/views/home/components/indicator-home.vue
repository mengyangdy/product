<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import Loading from '@/components/loading.vue'
import { _css } from '@/utils/dom.ts'
import { useMainStore } from '@/store'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  index: {
    type: Number,
    default: 0
  },
  isLight: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:index', 'showSlidebar'])

const tabs = ref()
const indicatorRef = ref()
const mainStore = useMainStore()
const { judgeValue, homeRefresh } = storeToRefs(mainStore)
const lefts = ref<number[]>([])
const indicatorSpace = ref(0)

onMounted(() => {
  initTabs()
})

function initTabs() {
  const indicatorWidth = _css(indicatorRef.value, 'width')
  for (let i = 0; i < tabs.value.children.length; i++) {
    const item = tabs.value.children[i]
    const tabWidth = _css(item, 'width')
    lefts.value.push(
      item.getBoundingClientRect().x -
        tabs.value.children[0].getBoundingClientRect().x +
        (tabWidth * 0.5 - indicatorWidth / 2)
    )
  }
  indicatorSpace.value = lefts.value[1] - lefts.value[0]
  _css(indicatorRef.value, 'transition-duration', '300ms')
  _css(indicatorRef.value, 'left', `${lefts.value[props.index]}px`)
}

const moveY = ref(0)

const transform = computed(() => {
  return `translate3d(0,${
    moveY.value - judgeValue.value > homeRefresh.value
      ? homeRefresh.value
      : moveY.value - judgeValue.value
  }px,0)`
})

const noticeStyle = computed(() => {
  if (props.loading) {
    return {
      opacity: 0
    }
  }
  if (moveY.value) {
    return {
      opacity: (moveY.value - judgeValue.value) / (homeRefresh.value / 2) - 0.5,
      transform: transform.value
    }
  }
  return {
    opacity: 0
  }
})

const toolbarStyle = computed(() => {
  if (props.loading) {
    return {
      opacity: 1,
      'transition-duration': '300ms',
      transform: `translate3d(0,0,0)`
    }
  }
  if (moveY.value) {
    return {
      opacity: 1 - (moveY.value - judgeValue.value) / (homeRefresh.value / 2),
      transform: transform.value
    }
  }
  return {
    opacity: 1,
    'transition-duration': '300ms',
    transform: `translate3d(0, 0, 0)`
  }
})

const loadingStyle = computed(() => {
  if (props.loading) {
    return { opacity: 1, 'transition-duration': '300ms' }
  }
  if (moveY.value) {
    return {
      opacity: (moveY.value - judgeValue.value) / (homeRefresh.value / 2) - 0.5,
      transform: transform.value
    }
  }
  return {}
})

function change(index: number) {
  emit('update:index', index)
  _css(indicatorRef.value, 'transition-duration', '300ms')
  _css(indicatorRef.value, 'left', `${lefts.value[index]}px`)
}
</script>

<template>
  <div
    class="indicator-home"
    :class="{ isLight }"
  >
    <div
      class="notice"
      :style="noticeStyle"
    >
      <span>下拉刷新内容</span>
    </div>
    <div
      ref="toolbar"
      class="toolbar"
      :style="toolbarStyle"
    >
      <Icon
        icon="tabler:menu-deep"
        class="search"
        style="transform: rotateY(180deg)"
        @click="emit('showSlidebar')"
      />
      <div class="tab-ctn">
        <div
          ref="tabs"
          class="tabs"
        >
          <div
            class="tab"
            :class="{ active: index === 0 }"
            @click.stop="change(0)"
          >
            <span>热点</span>
          </div>
          <div
            class="tab"
            :class="{ active: index === 1 }"
            @click.stop="change(1)"
          >
            <span>长视频</span>
          </div>
          <div
            class="tab"
            :class="{ active: index === 2 }"
            @click.stop="change(2)"
          >
            <span>关注</span>
            <img
              src="../../../assets/img/icon/live.webp"
              alt=""
              class="tab2-img"
            />
          </div>
          <div
            class="tab"
            :class="{ active: index === 3 }"
            @click.stop="change(3)"
          >
            <span>经验</span>
          </div>
          <div
            class="tab"
            :class="{ active: index === 4 }"
            @click.stop="change(4)"
          >
            <span>推荐</span>
          </div>
        </div>
        <div
          ref="indicatorRef"
          class="indicator"
        ></div>
      </div>
      <Icon
        v-hide="loading"
        icon="ion:search"
        class="search"
        @click="$router.push('/home/search')"
      />
    </div>
    <Loading
      :syle="loadingStyle"
      class="loading"
      style="width: 40rem"
      :is-full-screen="false"
    />
  </div>
</template>

<style scoped lang="less">
.indicator-home {
  position: absolute;
  font-size: 16rem;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  color: white;
  height: var(--home-header-height);
  transition: all 0.3s;
  font-weight: bold;
  .notice {
    opacity: 0;
    top: 0;
    position: absolute;
    width: 100vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loading {
    opacity: 0;
    top: 7rem;
    right: 7rem;
    position: absolute;
  }
  .toolbar {
    z-index: 2;
    position: relative;
    color: white;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tab-ctn {
      width: 80%;
      position: relative;
      .tabs {
        display: flex;
        justify-content: space-between;
        .tab {
          transition: color 0.3s;
          color: rgba(white, 0.7);
          position: relative;
          font-size: 17rem;
          cursor: pointer;
          .tab1-img {
            position: absolute;
            @width: 12rem;
            width: @width;
            height: @width;
            margin-left: 4rem;
            transition: all 0.3s;
          }
          .tab2-img {
            position: absolute;
            height: 15rem;
            left: 24rem;
            top: -5rem;
          }
          &:active {
            color: white;
          }
        }
      }
      .indicator {
        position: absolute;
        bottom: -6rem;
        width: 26rem;
        height: 2.6rem;
        background: #fff;
        border-radius: 5rem;
      }
    }
    .search {
      color: white;
      font-size: 24rem;
      cursor: pointer;
    }
  }
  .mask {
    position: absolute;
    top: 0;
    width: 100vw;
    height: calc(var(--vh, 1vh) * 100);
    background: #00000066;
  }
}
</style>
