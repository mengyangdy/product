<template>
  <div class="music-wrapper">
    <div
      v-if="isMuted"
      v-click="() => bus.emit(EVENT_KEY.REMOVE_MUTED)"
      class="mute-icon"
      :class="showMutedNotice && 'notice'"
    >
      <div class="wrap">
        <Icon icon="flowbite:volume-mute-solid" />
        <span :style="{ opacity: showMutedNotice ? 1 : 0 }">取消静音</span>
      </div>
    </div>
    <img
      v-click="
        () =>
          bus.emit(EVENT_KEY.NAV, {
            path: '/home/music',
            query: {
              id: item.aweme_id
            }
          })
      "
      class="music"
      :src="item.music?.cover_thumb.url_list[0]"
      :style="style"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

import bus, { EVENT_KEY } from '@/utils/bus.ts'
import { useClick } from '@/hooks/useClick.ts'

const isPlaying = inject<boolean>('isPlaying')
const isMuted = inject('isMuted')
const item = inject<any>('item')
const vClick = useClick()
const showMutedNotice = ref(window.showMutedNotice)

const style = computed(() => {
  return {
    webkitAnimationPlayState: isPlaying.value ? 'running' : 'paused'
  }
})

onMounted(() => {
  bus.on(EVENT_KEY.HIDE_MUTED_NOTICE, () => {
    showMutedNotice.value = false
  })
})
</script>

<style scoped lang="less">
.music-wrapper {
  display: flex;
  justify-content: center;
  @w: 45rem;
  width: @w;
  height: @w;
  position: relative;

  .music {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: animations 5s linear forwards infinite;
    //animation-play-state:paused;
    //display: none;
  }

  @keyframes animations {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .mute-icon {
    .music;
    cursor: pointer;
    position: absolute;
    z-index: 1;
    right: 0;
    background: white;
    animation: unset;
    color: black;
    transition: all 0.5s;
    overflow: hidden;

    .wrap {
      width: 100rem;
      position: absolute;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.notice {
      border-radius: 50rem;
      width: 100rem;
    }

    svg {
      font-size: 22rem;
    }

    span {
      margin-left: 5rem;
      font-size: 13rem;
      word-break: keep-all;
      transition: all 0.5s;
    }
  }
}
</style>
