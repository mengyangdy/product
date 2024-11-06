<template>
  <div class="toolbar mb1r">
    <div class="avatar-ctn mb2r">
      <img
        v-click="() => bus.emit(EVENT_KEY.GO_USERINFO)"
        class="avatar"
        :src="item.author.avatar_168x168.url_list[0]"
        alt=""
      />
      <Transition name="fade">
        <div
          v-if="!item.isAttention"
          v-click="attention"
          class="options"
        >
          <img
            src="../../assets/img/icon/add-light.png"
            alt=""
            class="no"
          />
          <img
            class="yes"
            src="../../assets/img/icon/ok-red.png"
            alt=""
          />
        </div>
      </Transition>
    </div>
    <div
      v-click="loved"
      class="love mb2r"
    >
      <div>
        <img
          v-if="!item.isLoved"
          src="../../assets/img/icon/love.svg"
          class="love-image"
        />
        <img
          v-if="item.isLoved"
          src="../../assets/img/icon/loved.svg"
          class="love-image"
        />
      </div>
      <span>
        {{ formatNumber(item.statistics.digg_count) }}
      </span>
    </div>
    <div
      v-click="showComments"
      class="message mb2r"
    >
      <Icon
        icon="mage:message-dots-round-fill"
        class="icon"
        style="color: white"
      />
      <span>{{ formatNumber(item.statistics.comment_count) }}</span>
    </div>
    <div
      v-click="() => updateItem(props, 'isCollect', !item.isCollect)"
      class="message mb2r"
    >
      <Icon
        v-if="item.isCollect"
        icon="ic:round-star"
        class="icon"
        style="color: rgb(252, 179, 3)"
      />
      <Icon
        v-else
        icon="ic:round-star"
        class="icon"
        style="color: white"
      />
      <span>{{ formatNumber(item.statistics.comment_count) }}</span>
    </div>
    <div
      v-if="!props.isMy"
      v-click="() => bus.emit(EVENT_KEY.SHOW_SHARE)"
      class="share mb2r"
    >
      <img
        src="../../assets/img/icon/share-white-full.png"
        alt=""
        class="share-image"
      />
      <span>{{ formatNumber(item.statistics.share_count) }}</span>
    </div>
    <div
      v-else
      v-click="() => bus.emit(EVENT_KEY.SHOW_SHARE)"
      class="share mb2r"
    >
      <img
        src="../../assets/img/icon/menu-white.png"
        alt=""
        class="share-image"
      />
    </div>
    <BaseMusic />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { deepClone } from '@dylanjs/utils'

import bus, { EVENT_KEY } from '@/utils/bus.ts'
import { useClick } from '@/hooks/useClick.ts'

import { formatNumber } from '../../utils'

import BaseMusic from '@/components/base-music.vue'

import {Icon} from '@iconify/vue'

interface Props {
  isMy?: boolean
  item?: any
}

const props = withDefaults(defineProps<Props>(), {
  isMy: false,
  item: {}
})

const emit = defineEmits([
  'update:item',
  'goUserInfo',
  'showComments',
  'showShare',
  'goMusic'
])

const position = inject('position')

const updateItem = (props, key, val) => {
  const old = deepClone(props.item)
  old[key] = val
  emit('update:item', old)
  bus.emit(EVENT_KEY.UPDATE_ITEM, {
    position: position.value,
    item: old
  })
}

function loved() {
  updateItem(props, 'isLoved', !props.item.isLoved)
}

function attention(e) {
  e.currentTarget.classList.add('attention')
  setTimeout(() => {
    updateItem(props, 'isAttention', true)
  }, 1000)
}

function showComments() {
  bus.emit(EVENT_KEY.OPEN_COMMENTS, props.item.aweme_id)
}

const vClick = useClick()
</script>

<style scoped lang="less">
.toolbar {
  //width: 40px;
  position: absolute;
  bottom: 0;
  right: 10rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  .avatar-ctn {
    position: relative;

    @w: 45rem;

    .avatar {
      width: @w;
      height: @w;
      border: 3rem solid white;
      border-radius: 50%;
    }

    .options {
      position: absolute;
      border-radius: 50%;
      margin: auto;
      left: 0;
      right: 0;
      bottom: -5px;
      background: red;
      //background: black;
      width: 18rem;
      height: 18rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 1s;

      img {
        position: absolute;
        width: 14rem;
        height: 14rem;
        transition: all 1s;
      }

      .yes {
        opacity: 0;
        transform: rotate(-180deg);
      }

      &.attention {
        background: white;

        .no {
          opacity: 0;
          transform: rotate(180deg);
        }

        .yes {
          opacity: 1;
          transform: rotate(0deg);
        }
      }
    }
  }

  .love,
  .message,
  .share {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @width: 35rem;

    img {
      width: @width;
      height: @width;
    }

    span {
      font-size: 12rem;
    }
  }

  .icon {
    font-size: 40rem;
  }

  .loved {
    background: red;
  }
}
</style>
