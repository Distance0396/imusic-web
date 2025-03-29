<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'ActionBar',
  data() {
    return {
      isFocus: true,
    }
  },
  props: {
    isFollow: Object,
    // 是否显示关注
    isShowFollow: Boolean,
  },
  methods: {
    // 播放按钮
    submit() {
      this.$emit('submitPlay')
    },
    // 关注
    follow() {
      this.$emit('follow')
    },
    // 取消关注
    unfollow() {
      this.$emit('unfollow')
    },
  },
  mounted() {},
}
</script>

<template>
  <div class="action">
    <span class="play" @click="submit">
      <i class="iconfont icon-icon_play icon" style="font-size: 24px"></i>
    </span>
    <span v-if="isShowFollow">
      <span v-if="!isFollow" class="attention" @click.stop="follow">关注</span>
      <span v-else class="attention" @click.stop="unfollow">关注中</span>
    </span>
    <span class="follow">
      <slot></slot>
    </span>
  </div>
</template>

<style scoped lang="scss">
.action {
  padding: 20px 0 20px 20px;
  display: flex;
  align-items: center;
  width: 20rem;
  span:nth-child(n + 2) {
    margin-left: 20px;
  }
  .play {
    color: #ffffff;
    display: flex;
    min-width: 56px;
    min-height: 56px;
    border-radius: 50%;
    background-color: #409eff;
    justify-content: center;
    align-items: center;
    &:hover {
      transform: scale(1.1, 1.1);
      -webkit-transform: scale(1.1, 1.1);
      -moz-transform: scale(1.1, 1.1);
    }
  }
  .follow {
    font-size: 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    border-radius: 15px;
    i {
      font-size: 15px;
    }
    .icon,
    ::v-deep div span .el-popover__reference-wrapper .icon {
      color: #aeaeae;
      fill: #aeaeae;
      transition: all 0.2s;
      &:hover {
        color: #ffffff;
        fill: #ffffff;
      }
    }
  }
  .attention {
    padding: 10px 20px;
    text-align: center;
    border-radius: 20px;
    color: #ffffff;
    border: solid 2px #aeaeae;
    transition: all 0.2s;
    &:hover {
      border: solid 2px #ffffff;
    }
  }
}
</style>
