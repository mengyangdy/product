<template>
  <div class="indicator-home" :class="{isLight}">
    <div class="notice" :style="noticeStyle">
      <span>下拉刷新内容</span>
    </div>
    <div class="toolbar" ref="toolbar" :style="toolbrStyle">
      <Icon icon="tabler:menu-deep" class="search" @click="$emit('showSlidebar')" style="transform:rotateY(180deg)"/>
      <div class="tab-ctn">
        <div class="tabs" ref="tabs">
          <div class="tab" :class="{active:index === 0}" @click.stop="change(0)">
            <span>热点</span>
          </div>
          <div class="tab" :class="{active:index === 1}" @click.stop="change(1)">
            <span>长视频</span>
          </div>
          <div class="tab" :class="{active:index === 2}" @click.stop="change(2)">
            <span>关注</span>
            <img src="../../../assets/img/icon/live.webp" alt="" class="tab2-img">
          </div>
          <div class="tab" :class="{active:index ===3}" @click.stop="change(3)" )>
            <span>经验</span>
          </div>
          <div class="tab" :class="{active:index === 4}" @click.stop="change(4)">
            <span>推荐</span>
          </div>
        </div>
        <div class="indicator" ref="indicatorRef"></div>
      </div>
      <Icon style="{'opacity':opacity}" icon="ion:search" class="search" @click="$router.push('/home/search')"/>
    </div>
    <Loading :syle="loadingStyle" class="loading" style="width: 40rem" :is-full-screen="false"/>
  </div>
</template>

<script setup lang="ts">
import {Icon} from '@iconify/vue'
import Loading from "@/components/loading.vue";
import {computed, onMounted, ref} from "vue";
import {_css} from "@/utils/dom.ts";
import {useMainStore} from "@/store";
import {storeToRefs} from "pinia";

const props=defineProps({
  loading:{
    type:Boolean,
    default:false
  },
  name:{
    type:String,
    default:''
  },
  index:{
    type:Number,
    default:0
  },
  isLight:{
    type:Boolean,
    default:false
  }
})

const tabs=ref()
const indicatorRef=ref()
const mainStore=useMainStore()
const {judgeValue}=storeToRefs(mainStore)

onMounted(()=>{
  initTabs()
})

function initTabs(){
  let tabs=tabs.value
  let indicatorWidth=_css(indicatorRef.value,'with')

}

const moveY=ref(0)

const noticeStyle=computed(()=>{
  if(props.loading){
    return {
      opacity:0
    }
  }
  if(moveY.value){
    return {
      opacity: moveY.value -
    }
  }
})


</script>