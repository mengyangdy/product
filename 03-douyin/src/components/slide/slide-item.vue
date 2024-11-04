<template>
  <div class="slide-item">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.slide-item{
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
}
</style>