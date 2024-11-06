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

<script setup lang="ts">
import { recommendedVideo } from '@/api/video'
import SlideItem from '@/components/slide/slide-item.vue'

import SlideList from './slide-list.vue'

interface Props {
  active: boolean
}
const props = withDefaults(defineProps<Props>(), {
  active: false
})
const style = {
  background: `#000`
}
</script>
