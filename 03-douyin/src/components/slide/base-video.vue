<template>
  <div
    ref="videoWrapper"
    class="video-wrapper"
    :class="positionName"
  >
    <video
      ref="videoEl"
      :poster="poster"
      :muted="state.isMuted"
      preload="true"
      loop
      x5-video-player-type="h5-page"
      :x5-video-player-fullscreen="false"
      :webkit-playsinline="true"
      :x5-playsinline="true"
      :fullscreen="false"
      :autoplay="isPlay"
    >
      <template v-if="item.video.ply_addr">
        <source
          v-for="(urlItem, index) in item.video.ply_addr.url_list"
          :key="index"
          :src="urlItem"
          type="video/mp4"
        />
      </template>

      <p>您的浏览器不支持 video 标签。</p>
    </video>
    <Icon
      v-if="!isPlaying"
      icon="fluent:play-28-filled"
      class="pause-icon"
    />
    <div class="float">
      <template v-if="isLive">
        <div class="living">点击进入直播间</div>
        <ItemDesc
          v-model:item="state.localItem"
          :is-live="true"
          :position="position"
        />
      </template>
      <template v-else>
        <div
          :style="{ opacity: state.isMove ? 0 : 1 }"
          class="normal"
        >
          <template v-if="!state.commentVisible">
            <ItemToolbar v-model:item="state.localItem" />
            <ItemDesc v-model:item="state.localItem" />
          </template>
          <div
            v-if="isMy"
            class="comment-status"
          >
            <div class="comment">
              <div class="type-comment">
                <img
                  src="../../assets/img/icon/head-image.jpeg"
                  alt=""
                  class="avatar"
                />
                <div class="right">
                  <p>
                    <span class="name">zzzzz</span>
                    <span class="time">2020-01-20</span>
                  </p>
                  <p class="text">北京</p>
                </div>
              </div>
              <TransitionGroup
                name="comment-status"
                tag="div"
                class="loveds"
              >
                <div
                  v-for="i in state.test"
                  :key="i"
                  class="type-loved"
                >
                  <img
                    src="../../assets/img/icon/head-image.jpeg"
                    alt=""
                    class="avatar"
                  />
                  <img
                    src="../../assets/img/icon/love.svg"
                    alt=""
                    class="loved"
                  />
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
        <div
          ref="progressEl"
          class="progress"
          :class="progressClass"
          @click="null"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
        >
          <div
            v-if="state.isMove"
            class="time"
          >
            <span class="currentTime">{{ duration(state.currentTime) }}</span>
            <span class="duration">/ {{ duration(state.duration) }}</span>
          </div>
          <template v-if="state.duration > 15 || state.isMove || !isPlaying">
            <div class="bg"></div>
            <div
              class="progress-line"
              :style="durationStyle"
            ></div>
            <div class="point"></div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'

import { SlideItemPlayStatus } from '@/utils/const_var.ts'
import { checkImgUrl, duration } from '@/utils'
import bus, { EVENT_KEY } from '@/utils/bus.ts'

defineOptions({
  name: 'BaseVideo'
})
// 为 props 提供默认值
const props = withDefaults(defineProps<Props>(), {
  item: () => ({}),
  position: () => ({}),
  isPlay: () => true,
  isMy: () => false,
  isLive: () => false
})
console.log(props.item)

// 定义 props 的 TypeScript 接口
interface Props {
  item?: Record<string, any>
  position?: Record<string, any>
  isPlay?: boolean
  isMy?: boolean
  isLive?: boolean
}

const videoEl = ref<HTMLVideoElement>()
const progressEl = ref<HTMLDivElement>()

const state = reactive({
  loading: false,
  paused: false,
  isMuted: window.isMuted,
  status: props.isPlay ? SlideItemPlayStatus.Play : SlideItemPlayStatus.Pause,
  duration: 0,
  step: 0,
  currentTime: -1,
  playX: 0,
  start: { x: 0 },
  last: { x: 0, time: 0 },
  height: 0,
  width: 0,
  isMove: false,
  ignoreWaiting: false,
  test: [1, 2],
  localItem: props.item,
  progressBarRect: {
    height: 0,
    width: 0
  },
  videoScreenHeight: 0,
  commentVisible: false
})

const poster = computed(() => {
  return checkImgUrl(
    props.item.video.poster ?? props.item.video.cover.url_list[0]
  )
})

const durationStyle = computed(() => {
  return {
    width: `${state.playX}px`
  }
})

const isPlaying = computed(() => {
  return state.status === SlideItemPlayStatus.Play
})

const positionName = computed(() => {
  return `item-${Object.values(props.position).join('-')}`
})

const progressClass = computed(() => {
  if (state.isMove) {
    return 'move'
  }
  return isPlaying.value ? '' : 'stop'
})

onMounted(() => {
  state.height = document.body.clientHeight
  state.width = document.body.clientWidth
  videoEl.value.currentTime = 0
  const fun = e => {
    state.currentTime = Math.ceil(e.target.currentTime)
    state.playX = (state.currentTime - 1) * state.step
  }
  videoEl.value.addEventListener('loadedmetadata', () => {
    state.videoScreenHeight =
      videoEl.value.videoHeight / (videoEl.value.videoWidth / state.width)
    state.duration = videoEl.value.duration
    state.progressBarRect = progressEl.value.getBoundingClientRect()
    state.step = state.progressBarRect.width / Math.floor(state.duration)
    videoEl.value.addEventListener('timeupdate', fun)
  })

  const eventTester = (e, t: string) => {
    videoEl.value?.addEventListener(
      e,
      () => {
        if (e === 'playing') {
          state.loading = false
        }
        if (e === 'waiting') {
          if (!state.paused && !state.ignoreWaiting) {
            state.loading = true
          }
        }
        // const s = false
        // if (s) {
        // }
      },
      false
    )
  }
  // eventTester("loadstart", '客户端开始请求数据'); //客户端开始请求数据
  // eventTester("abort", '客户端主动终止下载（不是因为错误引起）'); //客户端主动终止下载（不是因为错误引起）
  // eventTester("loadstart", '客户端开始请求数据'); //客户端开始请求数据
  // eventTester("progress", '客户端正在请求数据'); //客户端正在请求数据
  // // eventTester("suspend", '延迟下载'); //延迟下载
  // eventTester("abort", '客户端主动终止下载（不是因为错误引起），'); //客户端主动终止下载（不是因为错误引起），
  // eventTester("error", '请求数据时遇到错误'); //请求数据时遇到错误
  // eventTester("stalled", '网速失速'); //网速失速
  // eventTester("play", 'play()和autoplay开始播放时触发'); //play()和autoplay开始播放时触发
  // eventTester("pause", 'pause()触发'); //pause()触发
  // eventTester("loadedmetadata", '成功获取资源长度'); //成功获取资源长度
  // eventTester("loadeddata"); //
  eventTester('waiting', '等待数据，并非错误')
  eventTester('playing', '开始播放')
  // eventTester("canplay", '/可以播放，但中途可能因为加载而暂停'); //可以播放，但中途可能因为加载而暂停
  // eventTester("canplaythrough", '可以播放，歌曲全部加载完毕'); //可以播放，歌曲全部加载完毕
  // eventTester("seeking", '寻找中'); //寻找中
  // eventTester("seeked", '寻找完毕'); //寻找完毕
  // // eventTester("timeupdate",'播放时间改变'); //播放时间改变
  // eventTester("ended", '播放结束'); //播放结束
  // eventTester("ratechange", '播放速率改变'); //播放速率改变
  // eventTester("durationchange", '资源长度改变'); //资源长度改变
  // eventTester("volumechange", '音量改变'); //音量改变

  // console.log('mounted')
  // bus.off('singleClickBroadcast')
  bus.on(EVENT_KEY.SINGLE_CLICK_BROADCAST, click)
  bus.on(EVENT_KEY.DIALOG_MOVE, onDialogMove)
  bus.on(EVENT_KEY.DIALOG_END, onDialogEnd)
  bus.on(EVENT_KEY.OPEN_COMMENTS, onOpenComments)
  bus.on(EVENT_KEY.CLOSE_COMMENTS, onCloseComments)
  bus.on(EVENT_KEY.OPEN_SUB_TYPE, onOpenSubType)
  bus.on(EVENT_KEY.CLOSE_SUB_TYPE, onCloseSubType)

  bus.on(EVENT_KEY.REMOVE_MUTED, removeMuted)
})
onUnmounted(() => {
  bus.off(EVENT_KEY.SINGLE_CLICK_BROADCAST, click)
  bus.off(EVENT_KEY.DIALOG_MOVE, onDialogMove)
  bus.off(EVENT_KEY.DIALOG_END, onDialogEnd)
  bus.off(EVENT_KEY.OPEN_COMMENTS, onOpenComments)
  bus.off(EVENT_KEY.CLOSE_COMMENTS, onCloseComments)
  bus.off(EVENT_KEY.OPEN_SUB_TYPE, onOpenSubType)
  bus.off(EVENT_KEY.CLOSE_SUB_TYPE, onCloseSubType)
  bus.off(EVENT_KEY.REMOVE_MUTED, removeMuted)
})

function removeMuted() {
  state.isMuted = false
}

function onOpenSubType() {
  state.commentVisible = true
}

function onCloseSubType() {
  state.commentVisible = false
}

function onDialogMove({ tag, e }) {
  if (state.commentVisible && tag === 'comment') {
    _css(videoEl, 'transition-duration', `0ms`)
    _css(videoEl, 'height', `calc(var(--vh, 1vh) * 30 + ${e}px)`)
  }
}

function onDialogEnd({ tag, isClose }) {
  if (state.commentVisible && tag === 'comment') {
    console.log('isClose', isClose)
    _css(videoEl, 'transition-duration', `300ms`)
    if (isClose) {
      state.commentVisible = false
      _css(videoEl, 'height', '100%')
    } else {
      _css(videoEl, 'height', 'calc(var(--vh, 1vh) * 30)')
    }
  }
}

function onOpenComments(id) {
  if (id === props.item.aweme_id) {
    _css(videoEl, 'transition-duration', `300ms`)
    _css(videoEl, 'height', 'calc(var(--vh, 1vh) * 30)')
    state.commentVisible = true
  }
}

function onCloseComments() {
  if (state.commentVisible) {
    _css(videoEl, 'transition-duration', `300ms`)
    _css(videoEl, 'height', '100%')
    state.commentVisible = false
  }
}

function click({ uniqueId, index, type }) {
  if (props.position.uniqueId === uniqueId && props.position.index === index) {
    if (type === EVENT_KEY.ITEM_TOGGLE) {
      if (props.isLive) {
        pause()
        bus.emit(EVENT_KEY.NAV, {
          path: '/home/live',
          query: { id: props.item.aweme_id }
        })
      } else if (state.status === SlideItemPlayStatus.Play) {
        pause()
      } else {
        play()
      }
    }
    if (type === EVENT_KEY.ITEM_STOP) {
      videoEl.value.currentTime = 0
      state.ignoreWaiting = true
      pause()
      setTimeout(() => (state.ignoreWaiting = false), 300)
    }
    if (type === EVENT_KEY.ITEM_PLAY) {
      videoEl.value.currentTime = 0
      state.ignoreWaiting = true
      play()
      setTimeout(() => (state.ignoreWaiting = false), 300)
    }
  }
}

function play() {
  state.status = SlideItemPlayStatus.Play
  videoEl.value.volume = 1
  videoEl.value.play()
}

function pause() {
  state.status = SlideItemPlayStatus.Pause
  videoEl.value.pause()
}

function touchstart(e) {
  _stopPropagation(e)
  state.start.x = e.touches[0].pageX
  state.last.x = state.playX
  state.last.time = state.currentTime
}

function touchmove(e) {
  // console.log('move',e)
  _stopPropagation(e)
  state.isMove = true
  pause()
  const dx = e.touches[0].pageX - state.start.x
  state.playX = state.last.x + dx
  state.currentTime = state.last.time + Math.ceil(Math.ceil(dx) / state.step)
  if (state.currentTime <= 0) state.currentTime = 0
  if (state.currentTime >= state.duration) state.currentTime = state.duration
}

function touchend(e) {
  // console.log('end', e)
  _stopPropagation(e)
  if (isPlaying.value) return
  setTimeout(() => (state.isMove = false), 1000)
  videoEl.value.currentTime = state.currentTime
  play()
}

provide(
  'isPlaying',
  computed(() => isPlaying)
)
provide(
  'isMuted',
  computed(() => state.isMuted)
)
provide(
  'position',
  computed(() => props.position)
)
provide(
  'item',
  computed(() => props.item)
)
</script>

<style scoped lang="less">
.video-wrapper {
  position: relative;
  font-size: 14rem;
  width: 100%;
  height: 100%;
  text-align: center;

  video {
    max-width: 100%;
    height: 100%;
    transition:
      height,
      margin-top 0.3s;
    //background: black;
    /*position: absolute;*/
  }

  .float {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;

    .normal {
      position: absolute;
      bottom: 0;
      width: 100%;
      transition: all 0.3s;

      .comment-status {
        display: flex;
        align-items: center;

        .comment {
          .type-comment {
            display: flex;
            background: rgb(130, 21, 44);
            border-radius: 50px;
            padding: 3px;
            margin-bottom: 20px;

            .avatar {
              width: 36px;
              height: 36px;
              border-radius: 50%;
            }

            .right {
              margin: 0 10px;
              color: var(--second-text-color);

              .name {
                margin-right: 10px;
              }

              .text {
                color: white;
              }
            }
          }

          .loveds {
          }

          .type-loved {
            width: 40px;
            height: 40px;
            position: relative;
            margin-bottom: 20px;
            animation: test 1s;
            animation-delay: 0.5s;

            .avatar {
              width: 36px;
              height: 36px;
              border-radius: 50%;
            }

            .loved {
              position: absolute;
              bottom: 0;
              left: 20px;
              width: 10px;
              height: 10px;
              background: red;
              padding: 3px;
              border-radius: 50%;
              border: 2px solid white;
            }
          }

          @keyframes test {
            from {
              display: block;
              transform: translate3d(0, 0, 0);
            }
            to {
              display: none;
              transform: translate3d(0, -60px, 0);
            }
          }
        }
      }
    }

    .progress {
      z-index: 10;
      @w: 90%;
      position: absolute;
      bottom: -1rem;
      height: 10rem;
      left: calc((100% - @w) / 2);
      width: @w;
      display: flex;
      align-items: flex-end;
      margin-bottom: 2rem;

      .time {
        position: absolute;
        z-index: 9;
        font-size: 24px;
        bottom: 50px;
        left: 0;
        right: 0;
        color: white;
        text-align: center;

        .duration {
          color: darkgray;
        }
      }

      @radius: 10rem;

      @h: 2rem;
      @tr: height 0.3s;

      .bg {
        transition: @tr;
        position: absolute;
        width: 100%;
        height: @h;
        background: #4f4f4f;
        border-radius: @radius;
      }

      @p: 50px;

      .progress-line {
        transition: @tr;
        height: calc(@h + 0.5rem);
        width: @p;
        border-radius: @radius 0 0 @radius;
        background: #777777;
        z-index: 1;
      }

      .point {
        transition: all 0.2s;
        width: @h+2;
        height: @h+2;
        border-radius: 50%;
        background: gray;
        z-index: 2;
        transform: translate(-1rem, 1rem);
      }
    }

    & .move {
      @h: 10rem;

      .bg {
        height: @h;
        background: var(--active-main-bg);
      }

      .progress-line {
        height: @h;
        background: var(--second-text-color);
      }

      .point {
        width: @h+2;
        height: @h+2;
        background: white;
      }
    }

    & .stop {
      @h: 4rem;

      .bg {
        height: @h;
      }

      .progress-line {
        height: @h;
        background: white;
      }

      .point {
        width: @h+2;
        height: @h+2;
        background: white;
      }
    }
  }
}

.living {
  position: absolute;
  left: 50%;
  font-size: 18rem;
  border-radius: 50rem;
  border: 1px solid #e0e0e0;
  padding: 15rem 20rem;
  line-height: 1;
  color: white;
  top: 70%;
  transform: translate(-50%, -50%);
}
</style>
