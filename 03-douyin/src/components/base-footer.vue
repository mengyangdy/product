<template>
  <div
    v-if="visible"
    class="footer"
    :class="{ isWhite }"
  >
    <div
      class="l-button"
      @click="refresh(1)"
    >
      <span
        v-if="!isRefresh1"
        :class="{ active: currentTab === 1 }"
      >
        首页
      </span>
      <img
        v-if="isRefresh1"
        src="../assets//img/icon/refresh1.png"
        alt=""
        class="refresh"
      />
    </div>
    <div
      class="l-button"
      @click="refresh(2)"
    >
      <span
        v-if="!isRefresh2"
        :class="{ active: currentTab === 2 }"
      >
        商城
      </span>
      <img
        v-if="isRefresh2"
        src="../assets//img/icon/refresh1.png"
        class="refresh"
        alt=""
      />
    </div>
    <div
      class="l-button"
      @click="tab(3)"
    >
      <div class="add-ctn">
        <img
          src="../assets//img/icon/add0light.png"
          class="add"
          alt=""
        />
      </div>
    </div>
    <div
      class="l-button"
      @click="tab(4)"
    >
      <span :class="{ active: currentTab === 4 }">消息</span>
      <div class="badge">2</div>
    </div>
    <div
      class="l-button"
      @click="tab(5)"
    >
      <span :class="{ active: currentTab === 5 }">我</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import bus, { EVENT_KEY } from '@/utils/bus.ts'

defineOptions({
  name: 'BaseFooter'
})

const props = withDefaults(defineProps<Props>(), {
  initTab:1,
  isWhite:false
})

interface Props {
  initTab: number
  isWhite?: boolean
}

const isRefresh1 = ref(false)
const isRefresh2 = ref(false)
const currentTab = ref(props.initTab)
const visible = ref(true)
const router = useRouter()

onUnmounted(() => {
  bus.off(EVENT_KEY.ENTER_FULLSCREEN)
  bus.off(EVENT_KEY.EXIT_FULLSCREEN)
})

function init() {
  bus.on('setFooterVisible', e => (visible.value = e))
  bus.on(EVENT_KEY.ENTER_FULLSCREEN, () => (visible.value = false))
  bus.on(EVENT_KEY.EXIT_FULLSCREEN, () => (visible.value = true))
}

function nav(path) {
  router.push(path)
}

// eslint-disable-next-line consistent-return
function tab(index) {
  switch (index) {
    case 1:
      nav('/')
      break
    case 2:
      nav('/shop')
      break
    case 3:
      nav('/publish')
      break
    case 4:
      nav('/message')
      break
    case 5:
      nav('/me')
      break
    default:
      return false
  }
}

function refresh(index) {
  if (currentTab.value === index) {
    if (index === 1) {
      isRefresh1.value = !isRefresh1.value
    } else {
      isRefresh2.value = !isRefresh2.value
    }
    setTimeout(()=>{
      if (index === 1) {
        isRefresh1.value = !isRefresh1.value
      } else {
        isRefresh2.value = !isRefresh2.value
      }
    },2000)
  }else{
    tab(index)
  }
}

init()
</script>

<style scoped lang="less">
.footer {
  font-size: 14rem;
  position: fixed;
  width: 100%;
  height: var(--footer-height);
  z-index: 2;
  top: calc(var(--vh, 1vh) * 100 - var(--footer-height));
  background: var(--footer-color);
  color: white;
  display: flex;
  &.isWhite {
    background: white !important;
    color: #000 !important;
  }
  .l-button {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: 16rem;
    .refresh {
      width: 25%;
      animation: rotate 0.5s linear infinite;
    }
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(-360deg);
      }
    }
    .add-ctn {
      cursor: pointer;
      @height: 27rem;
      @width: 36rem;
      height: @height;
      width: @width;
      border-radius: 6rem;
      box-sizing: border-box;
      padding: 0 2rem;
      border: 3rem solid white;
      background: black;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 20rem;
      }
    }
    span {
      cursor: pointer;
      font-weight: bold;
      opacity: 0.7;
      &.active {
        opacity: 1;
      }
    }
    .badge {
      right: 14rem;
      top: 12rem;
      position: absolute;
    }
  }
}
</style>
