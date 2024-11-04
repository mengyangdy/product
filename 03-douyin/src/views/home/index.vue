<template>
  <div class="test-slide-wrapper" id="home-index">
    <SlideHorizontal name="first" v-model:index="state.baseIndex">
      <SlideItem class="sidebar">
        <div class="header">
          <div class="left">下午好</div>
          <div class="right" @click="nav('/home/live')">
            <Icon icon="iconamoon:scanner"/>
            <span>扫一扫</span>
          </div>
        </div>
      </SlideItem>
      <SlideItem>
        <IndicatorHome v-if="!state.fullScreen" :loading="baseStore.loading" name="second"
                       @showSlidebar="state.baseIndex =0" v-model:index="state.navIndex"/>
      </SlideItem>
    </SlideHorizontal>
  </div>
</template>

<script setup lang="tsx">
import SlideHorizontal from '@/components/slide/slide-horizontal.vue'
import SlideItem from '@/components/slide/slide-item.vue'
import IndicatorHome from './components/indicator-home.vue'
import {useNav} from '@/components/slide/useNav';
import {onMounted, reactive} from "vue";
import {useMainStore} from "@/store";
import {DefaultUser} from "@/utils/const_var.ts";

const nav = useNav()

const baseStore = useMainStore()

const state = reactive({
  active: true,
  baseIndex: 1,
  navIndex: 4,
  itemIndex: 0,
  test: '',
  recommendList: [],
  isSharing: false,
  canMove: true,
  shareType: -1,
  showPlayFeedback: false,
  showShareDuoshan: false,
  showShareDialog: false,
  showShare2WeChatZone: false,
  showDouyinCode: false,
  showFollowSetting: false,
  showFollowSetting2: false,
  showBlockDialog: false,
  showChangeNote: false,
  shareToFriend: false,

  commentVisible: false,
  fullScreen: false,
  currentItem: {
    aweme_id: '',
    author: DefaultUser,
    isRequest: false,
    aweme_list: []
  }
})

onMounted(()=>{

})
</script>

<style scoped lang="less">

</style>