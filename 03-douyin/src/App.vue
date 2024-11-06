<script setup lang="ts"></script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition>
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style lang="less">
* {
  user-select: none;
}
#app {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 14rem;
}

@media screen and (min-width: 500px) {
  #app {
    width: 500px !important;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
