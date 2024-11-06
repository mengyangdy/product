<script setup lang="ts">
import { recommendedVideo } from '@/api/video'
import SlideItem from '@/components/slide/slide-item.vue'

import SlideList from './slide-list.vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
const style = {
  background: `#000`
}
</script>

<template>
  <SlideItem>
    <SlideList
      unique-id="home"
      :style="style"
      :active="props.active"
      :api="recommendedVideo"
    />
  </SlideItem>
</template>
