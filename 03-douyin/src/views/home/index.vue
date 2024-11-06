<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue'
import { Icon } from '@iconify/vue'

import { useNav } from '@/components/slide/useNav'
import { useMainStore } from '@/store'
import { DefaultUser } from '@/utils/const_var.ts'
import SlideItem from '@/components/slide/slide-item.vue'
import SlideHorizontal from '@/components/slide/slide-horizontal.vue'
import BaseMask from '@/components/base-mask.vue'
import { _no } from '@/utils'
import bus, { EVENT_KEY } from '@/utils/bus'
import FourSlideItem from '@/views/home/slide/four-slide-item.vue'

import IndicatorHome from './components/indicator-home.vue'

const nav = useNav()

const isMobile = ref(/Mobi|Android|iPhone/i.test(navigator.userAgent))

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

onMounted(() => {
  bus.on(EVENT_KEY.ENTER_FULLSCREEN, () => {
    if (!state.active) return
    state.fullScreen = true
  })
})
</script>

<template>
  <div
    id="home-index"
    class="test-slide-wrapper"
  >
    <SlideHorizontal
      v-model:index="state.baseIndex"
      name="first"
    >
      <SlideItem class="sidebar">
        <div class="header">
          <div class="left">下午好</div>
          <div
            class="right"
            @click="nav('/home/live')"
          >
            <Icon icon="iconamoon:scanner" />
            <span>扫一扫</span>
          </div>
        </div>
        <div class="card">
          <div class="header">
            <div class="left">常用小程序</div>
            <div class="right">
              <span>全部</span>
              <Icon icon="icon-park-outline:right" />
            </div>
          </div>
          <div class="content">
            <div
              class="item"
              @click="_no"
            >
              <img
                class="xcx"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/pipieh7nupabozups/toutiao_web_pc/tt-icon.png"
                alt=""
              />
              <span>今日头条</span>
            </div>
            <div
              class="item"
              @click="_no"
            >
              <img
                class="xcx"
                src="https://gd-hbimg.huaban.com/65130a3e6a139530bb03bd118e21a2603af7df4e1303b-OOzcBu_fw658webp"
                alt=""
              />
              <span>西瓜视频</span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="header">
            <div class="left">最近常看</div>
            <div class="right">
              <span>全部</span>
              <Icon icon="icon-park-outline:right" />
            </div>
          </div>
          <div class="content">
            <div
              v-for="item in 6"
              :key="item"
              class="item avatar"
              @click="_no"
            >
              <img
                src="https://img.tol.vip/avatar/WEIXIN/3aSuTGYTzjHvcHy0y0tH1eiShKRk9Sgd.jpg?_upt=de4a5c251709635127"
              />
              <span>随机名字</span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="header">
            <div class="left">常用功能</div>
            <div class="right"></div>
          </div>
          <div class="content">
            <div
              class="item"
              @click="_no"
            >
              <Icon icon="ion:wallet-outline" />
              <span>我的钱包</span>
            </div>
            <div
              class="item"
              @click="_no"
            >
              <Icon icon="mingcute:coupon-line" />
              <span>券包</span>
            </div>
            <div
              class="item"
              @click="_no"
            >
              <Icon icon="icon-park-outline:bytedance-applets" />
              <span>小程序</span>
            </div>
            <div
              class="item"
              @click="_no"
            >
              <Icon icon="solar:history-linear" />
              <span>观看历史</span>
            </div>
            <div
              class="item"
              @click="_no"
            >
              <Icon icon="fluent:content-settings-24-regular" />
              <span>内容偏好</span>
            </div>
            <div
              class="item"
              @click="_no"
            >
              <Icon icon="iconoir:cloud-download" />
              <span>离线模式</span>
            </div>
            <div
              class="item"
              @click="_no"
            >
              <Icon icon="ep:setting" />
              <span>设置</span>
            </div>
            <div
              class="item"
              @click="_no"
            >
              <Icon icon="icon-park-outline:baggage-delay" />
              <span>稍后再看</span>
            </div>
          </div>
        </div>
      </SlideItem>
      <SlideItem>
        <IndicatorHome
          v-if="!state.fullScreen"
          v-model:index="state.navIndex"
          :loading="baseStore.loading"
          name="second"
          @show-slidebar="state.baseIndex = 0"
        />
        <SlideHorizontal
          v-model:index="state.navIndex"
          class="first-horizontal-item"
          name="second"
          :change-active-index-use-anim="false"
        >
          <FourSlideItem
            :active="state.navIndex === 4 && state.baseIndex === 1"
          />
        </SlideHorizontal>
      </SlideItem>
    </SlideHorizontal>
    <BaseMask
      v-if="!isMobile"
      @click="isMobile = true"
    />
    <div
      v-if="!isMobile"
      class="guide"
    >
      <Icon
        class="danger"
        icon="mynaui:danger-triangle"
      />
      <Icon
        class="close"
        icon="simple-line-icons:close"
        @click="isMobile = true"
      />
      <div class="txt">
        <h2>切换至手机模式获取最佳体验</h2>
        <h3>1. 按 F12 调出控制台</h3>
        <h3>2. 按 Ctrl+Shift+M，或点击下面图标</h3>
      </div>
      <img
        src="@/assets/img/guide.png"
        alt=""
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.test-slide-wrapper {
  font-size: 14rem;
  width: 100%;
  height: 100%;
  background: black;
  overflow: hidden;
  .sidebar {
    touch-action: pan-y;
    width: 80%;
    height: calc(var(--vh, 1vh) * 100);
    overflow: auto;
    background: rgb(22, 22, 22);
    padding: 10rem;
    padding-bottom: 20rem;
    box-sizing: border-box;
    & > .header {
      font-size: 16rem;
      display: flex;
      color: white;
      justify-content: space-between;
      align-items: center;
      .right {
        border-radius: 20rem;
        padding: 8rem 15rem;
        background: rgb(36, 36, 36);
        display: flex;
        align-items: center;
        font-size: 14rem;
        gap: 10rem;
        svg {
          font-size: 18rem;
        }
      }
    }
    .card {
      margin-top: 10rem;
      border-radius: 12rem;
      padding: 15rem;
      background: rgb(29, 29, 29);
      .header {
        margin-bottom: 8rem;
        font-size: 14rem;
        display: flex;
        color: white;
        justify-content: space-between;
        align-items: center;
        .right {
          display: flex;
          align-items: center;
          font-size: 12rem;
          gap: 4rem;
          color: gray;
          svg {
            font-size: 16rem;
          }
        }
      }
      .content {
        color: white;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        .item {
          min-height: 20vw;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 14rem;
          gap: 8rem;
          svg {
            font-size: 28rem;
          }
          .xcx {
            border-radius: 12rem;
            width: 50rem;
            height: 50rem;
          }
        }
        .avatar {
          height: 25vw;
          img {
            border-radius: 50%;
            width: 50rem;
          }
        }
      }
    }
  }
  .slide-content {
    width: 100%;
    height: 100%;
  }
}

.guide {
  color: white;
  z-index: 999;
  background: var(--active-main-bg);
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16rem;
  overflow: hidden;
  text-align: center;
  .danger {
    margin-top: 10rem;
    font-size: 40rem;
    color: red;
  }
  .close {
    cursor: pointer;
    font-size: 18rem;
    color: white;
    position: absolute;
    right: 15rem;
    top: 15rem;
  }
  .txt {
    text-align: left;
    padding: 0 24rem;
  }
  img {
    display: block;
    width: 350rem;
  }
}
</style>
