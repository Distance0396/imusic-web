<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'RecommendCard',
  props: {
    obj: {
      type: Object,
    },
  },
  methods: {
    ...mapMutations('playlist', ['appoint']),
    ...mapActions('player', ['playSong', 'getLyricAndAudio']),
    ...mapMutations('player', ['setStatus']),
    play() {
      this.appoint(this.obj)
      this.setStatus(true)
      this.playSong(this.obj)
    },
  },
}
</script>

<template>
  <div class="block" :style="{ backgroundImage: `url(${obj?.image})` }">
    <div class="info">
      <div class="name">{{ obj?.name }}</div>
      <div class="musicInfo">
        <i @click="() => $router.push(`/singer/${obj?.singerId}`)">
          {{ obj?.singerName }}
        </i>
        ·
        <i @click="() => $router.push(`/album/${obj?.albumId}`)">
          {{ obj?.albumName }}
        </i>
      </div>
    </div>
    <div class="btn">
      <div class=""><i class="iconfont icon-shoucangjia1"></i></div>
      <div @click="play" class=""><i class="iconfont icon-icon_play"></i></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.block {
  //width: 600px;
  //width: 300px;
  height: 360px;
  min-width: 200px;
  max-width: 320px;
  background-size: cover; /* 确保背景图片填满容器 */
  background-position: center; /* 图片居中 */
  background-repeat: no-repeat; /* 不重复背景图 */
  position: relative;
  overflow: hidden;

  width: calc(10% - 20px); /* 每行三列布局，减去间距 */
  flex-grow: 1; /* 子项可以按比例扩展 */
  display: flex;
  flex-direction: column; /* 子元素垂直排列 */
  justify-content: space-between; /* 子内容均匀分布 */
  background-color: var(--article-table-back-color); /* 示例背景颜色 */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  /* 使用 ::after 伪元素实现背景变暗 */
  &:hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.35); /* 让背景变暗 */
    z-index: 1;
    transition: background 0.4s ease-out;
  }

  .btn,
  .info {
    z-index: 2; /* 确保按钮和信息显示在伪元素之上 */
  }
  &:hover .btn {
    bottom: 10px;
    opacity: 1; /* 鼠标悬浮时，显示按钮 */
  }
  .background {
    position: relative;
  }
  .info {
    position: absolute;
    top: 10px;
    left: 20px;
    .name {
      font-size: 30px;
      color: var(--text-color);
    }
    .musicInfo {
      font-size: 25px;
      color: var(--text-color);
      &:hover {
        text-decoration: underline 2px;
        transition: text-decoration 1s;
      }
    }
  }
  .btn {
    position: absolute;
    bottom: -70px;
    right: 10px;
    display: flex;
    align-items: center;
    transition: bottom 0.3s ease-in-out, opacity 0.7s ease-in-out;
    opacity: 0;
    div:nth-child(1) {
      margin: 0 10px 0 0;
      i {
        font-size: 23px;
      }
      &:hover {
        color: #dfdfdf;
      }
    }
    div:nth-child(2) {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #ededed;
      i {
        font-size: 23px;
      }
      &:hover {
        background-color: #ffffff;
      }
    }
    div {
      cursor: pointer;
      border-radius: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.2s ease-in;
    }
  }
}
</style>
