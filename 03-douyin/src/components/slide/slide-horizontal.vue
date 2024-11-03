<template>
  <div class="slide horizontal">
    <div class="indicator-bullets" v-if="indicator && state.wrapper.childrenLength">
      <div class="bullet" :class="{active:state.localIndex === item -1}" :key="i" v-for="(item,i) in state.wrapper.childrenLength">
      </div>
    </div>

    <div class="slide-list" ref="slideListEl" @pointerdown.prevent="touchStart" @pointermove.prevent="touchMove" @pointerup.prevent="touchEnd">
      <slot></slot>
    </div>
  </div>
</template>


<script setup lang="ts">
import { SlideType } from '@/utils/const_var';
import {onMounted,onUnmounted,reactive,ref,watch} from 'vue'

const props=defineProps({
  index:{
    type:Number,
    default:0
  },
  name:{
    type:String,
    default:''
  },
  autoplay:{
    type:Boolean,
    default:false
  },
  indicator:{
    type:Boolean,
    default:false
  },
  //改变index，是否使用动画
  changeActiveIndexUseAnim:{
    type:Boolean,
    default:true
  }
})

const emit=defineEmits(['update:index'])

let ob=null

const slideListEl=ref(null)

const state=reactive({
  judgeValue:20,
  type:SlideType.HORIZONTAL,
  name:props.name,
  localIndex:props.index,
  needCheck:true,
  next:false,
  isDown:false,
  start:{
    x:0,
    y:0,
    time:0
  },
  move:{
    x:0,
    y:0
  },
  wrapper:{
    width:0,
    height:0,
    childrenLength:0
  }
})

</script>

<style scoped lang="less">

</style>