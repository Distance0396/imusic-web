<script>
export default {
  name: 'BlockBlock',
  props: {
    showDeleteBtn: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
    }
  },
  methods: {
    changeLoad() {
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    delHistory() {
      this.$emit('del-history')
    },
  },
  mounted() {
    this.changeLoad()
  },
}
</script>

<template>
  <div>
    <el-skeleton :loading="isLoading" animated class="block">
      <template slot="template">
        <div class="block-loading">
          <span class="block-img">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 100%"
            />
          </span>
          <span class="block-name">
            <el-skeleton-item variant="h3" style="width: 50%" />
          </span>
          <span class="blockSingerName" style="font-size: 0.75rem">
            <el-skeleton-item variant="h3" style="width: 100%" />
          </span>
        </div>
      </template>
      <template>
        <div
          class="block-img"
          style="
            width: 8.5rem;
            height: 8.5rem;
            margin-bottom: 10px;
            position: relative;
          "
        >
          <span
            v-if="showDeleteBtn"
            @click="delHistory"
            class="del"
            style="position: absolute; right: -5px; top: -5px"
          >
            <svg
              class="icon"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
            >
              <path
                d="M806.4 263.2l-45.6-45.6L512 467.2 263.2 217.6l-45.6 45.6L467.2 512 217.6 760.8l45.6 45.6L512 557.6l248.8 248.8 45.6-45.6L557.6 512z"
                p-id="5316"
              ></path>
            </svg>
          </span>
          <slot name="img"></slot>
          <button class="btn iconfont icon-icon_play" />
        </div>
        <span
          class="block-name"
          style="
            width: 8.5rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          "
        >
          <i>
            <slot name="nameOne"></slot>
          </i>
        </span>
        <span class="blockSingerName" style="font-size: 0.75rem">
          <slot name="nameTwo"></slot>
        </span>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.block {
  padding: 9px 9px;
  margin: 1px;
  display: inline-flex;
  flex-direction: column;
  background-color: var(--block);
  color: var(--text-color);
  border-radius: 5px;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: var(--block-hover);
    transition: background-color 0.4s;
  }
  &:hover .block-img .btn {
    opacity: 1;
    transform: translateY(0); /* 悬停时按钮回到原位 */
  }
  .block-loading {
    display: inline-flex;
    flex-direction: column;
    background-color: var(--block);
    border-radius: 5px;
    justify-content: center;
    &:hover {
      background-color: var(--collect-item-color);
      transition: background-color 0.4s;
    }
  }
  .block-img {
    width: 8.5rem;
    height: 8.5rem;
    margin-bottom: 10px;
    position: relative;
    .btn {
      color: var(--info-text);
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(15px); /* 初始状态下，按钮向下移动 */
      transition: opacity 0.4s ease, transform 0.4s ease; /* 添加过渡效果 */
      opacity: 0;
      width: 50px;
      height: 50px;
      margin-left: auto;
      border-radius: 50%;
      background-color: #409eff;
    }
  }
  .block-name {
    font-size: 1rem;
    i:hover {
      text-decoration: underline 2px;
      transition: text-decoration 1s;
    }
  }
}
</style>
