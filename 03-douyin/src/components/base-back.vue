<template>
  <img
    ref="imgEl"
    class="close"
    :src="src"
    alt=""
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { css } from '@/utils'

defineOptions({
  name: 'BaseBack'
})

const props = defineProps({
  mode: {
    type: String,
    default: 'gray'
  },
  img: {
    type: String,
    default: 'back'
  },
  direction: {
    type: String,
    default: 'left'
  },
  scale: {
    type: [Number, String],
    default: 1
  }
})

const imgEl = ref()

const src = computed(() => {
  return new URL(
    `../assets/img/icon/components/${props.mode}-${props.img}.png`,
    import.meta.url
  )
})

onMounted(() => {
  css(
    imgEl,
    'transform',
    `rotate(${props.direction === 'left' ? '0' : '180'}deg) scale(${props.scale})`
  )
})
</script>

<style scoped lang="less"></style>
