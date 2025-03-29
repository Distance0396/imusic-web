<script>
export default {
  name: 'CollectItem',
  props: {
    musicForm: {
      type: Object,
    },
    singer: {
      type: Object,
    },
    album: {
      type: Object,
    },
    isPlaying: {
      type: Boolean,
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
      }, 800)
    },
  },
  mounted() {
    this.changeLoad()
  },
}
</script>

<template>
  <el-skeleton :loading="loading" animated class="musicForm">
    <template slot="template">
      <div class="musicForm-loading">
        <el-skeleton-item
          class="image"
          variant="image"
          style="width: 50px; height: 50px"
        />
        <div class="musicForm-info">
          <el-skeleton-item
            variant="h3"
            style="width: 50%; margin-bottom: 5px"
          />
          <el-skeleton-item variant="h3" style="width: 100%" />
        </div>
        <div></div>
      </div>
    </template>
    <template v-if="musicForm">
      <el-image class="image" :src="musicForm.image">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div
        class="musicForm-info"
        style="
          width: 100%;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          color: var(--text-color);
        "
      >
        <span>{{ musicForm.name }}</span>
        <span>歌单·{{ musicForm.architect }}</span>
      </div>
      <div></div>
    </template>
    <template v-if="album">
      <el-image class="image" :src="album?.image">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div
        class="musicForm-info"
        style="
          width: 100%;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          color: var(--text-color);
          overflow: hidden;
          text-overflow: ellipsis;
        "
      >
        <span>{{ album.name }}</span>
        <span>专辑·{{ album.singerName }}</span>
      </div>
      <div></div>
    </template>
    <template v-if="singer">
      <el-image
        class="image"
        :src="singer.avatar || singer.image"
        style="border-radius: 50%; object-fit: cover"
        fit="cover"
      >
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div
        class="musicForm-info"
        style="
          width: 100px;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          color: var(--text-color);
        "
      >
        <span>{{ singer.name }}</span>
        <span>歌手</span>
      </div>
      <div></div>
    </template>
    <div v-if="isPlaying" style="margin-left: auto; fill: #409eff">
      <svg
        class="icon"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
      >
        <path
          d="M74.968 386.328c-12.804 95.032-12.36 190.064 1.324 285.1 208.328 95.392 410.28 209.008 574.336 273.164 30.516-280.312 30.516-560.62 0-840.932-163.656 67.788-366.984 185.56-575.66 282.668zM746.592 321.516c110.64 10.8 219.008 106.056 219.72 202.608-0.712 96.552-109.08 191.804-219.72 202.608"
        ></path>
      </svg>
    </div>
  </el-skeleton>
</template>

<style scoped lang="scss">
.musicForm {
  width: 100%;
  padding: 6px 6px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 2px;
  &:hover {
    background-color: var(--collect-item-color);
    transition: background-color 0.2s linear;
  }

  .musicForm-loading {
    display: flex;
    align-items: center;
  }

  .image {
    border-radius: 5px;
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .musicForm-info {
    width: 100px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    color: var(--text-color);
    span:nth-child(2) {
      margin-top: 3px;
      font-size: 13px;
    }
    &:hover {
      //color: #FFFFFF;
      //color: var(--text-color);
    }
  }
}
</style>
