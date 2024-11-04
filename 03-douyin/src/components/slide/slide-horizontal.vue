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
import { _css } from '@/utils/dom';
import { getSlideOffset, slideInit, slideReset, slideTouchEnd, slideTouchMove, slideTouchStart } from '@/utils/slide';
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

const slideListEl=ref<HTMLElement>()

const state=reactive({
  judgeValue:20,// 用户判断滑动朝向的固定值
  type:SlideType.HORIZONTAL,// 组件类型
  name:props.name,// 组件名称
  localIndex:props.index,// 当前下标
  needCheck:true,// 是否需要检测 每次按下都需要检测，up事件置为true
  next:false, // 能否滑动
  isDown:false, // 是否按下 用于move事件判断
  start:{ // 按下时的起点坐标
    x:0,
    y:0,
    time:0
  },
  move:{ // 移动时的坐标
    x:0,
    y:0
  },
  wrapper:{ // slide-list的宽度和子元素个数
    width:0,
    height:0,
    // childrenlength用于canNext方法判断当前页是否是最后一页，不能滑动，不捕获事件
    childrenLength:0
  }
})

watch(()=>props.index,(newVal)=>{
  if(state.localIndex !== newVal){
    state.localIndex=newVal
    if(props.changeActiveIndexUseAnim){
      _css(slideListEl.value!,'transition-duration',`300ms`)
    }
    _css(slideListEl.value!,'transform',`translate3d(${getSlideOffset(state,slideListEl.value!)}px,0,0)`)
  }
})

onMounted(()=>{
  slideInit(slideListEl.value,state)
  if(props.autoplay){
    setInterval(()=>{
      if(state.localIndex === state.wrapper.childrenLength -1){
        emit('update:index',0)
      }else{
        emit('update:index',state.localIndex+1)
      }
    },3000)
  }
  // 观察子元素数量变化，获取最新数量
  // chlidrenLength用于canNext方法判断当前页是否是最后一页，是能滑动，不捕获事件
  ob=new MutationObserver(()=>{
    state.wrapper.childrenLength = slideListEl.value!.children.length
  })
  ob.observe(slideListEl.value!,{childList:true})
})

onUnmounted(()=>{
  ob.disconnect()
})

function touchStart(e){
  slideTouchStart(e,slideListEl.value,state)
}
function touchMove(e){
  slideTouchMove(e,slideListEl.value,state)
}
function touchEnd(e){
  slideTouchEnd(e,state)
  slideReset(e,slideListEl.value,state,emit)
}

</script>

<style scoped lang="less">
.indicator-bullets{
  position: absolute;
  bottom: 10rem;
  z-index:2;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 7rem;
  .bullet{
    @width:5rem;
    width: @width;
    height: @width;
    border-radius: 5%;
    background: var(--second-btn-color);
    &:active{
      background: white;
    }

  }
}
</style>