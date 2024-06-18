<script>
export default {
  name: 'MusicFormItem',
  props: {
    musicForm: {
      type: Object
    },
    singer: {
      type: Object
    },
    album: {
      type: Object
    }
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    changeLoad () {
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    skip () {
      this.$router.push(`/detail/music-form/${this.musicForm.id}`)
    }
  },
  mounted () {
    this.changeLoad()
  }
}
</script>

<template>
  <el-skeleton :loading="loading" animated class="musicForm">
    <template slot="template">
      <div class="musicForm-loading">
        <el-skeleton-item
          class="image"
          variant="image"
          style="width: 50px; height: 50px;"
        />
        <div class="musicForm-info">
          <el-skeleton-item variant="h3" style="width: 50%; margin-bottom: 5px"/>
          <el-skeleton-item variant="h3" style="width: 100%;"/>
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
      <div class="musicForm-info" style="display: flex; flex-direction: column; margin-left: 10px">
        <span>{{ musicForm.name }}</span>
        <span>歌单·{{ musicForm.architect }}</span>
      </div>
      <div></div>
    </template>
    <template v-if="singer">
      <el-image class="image" :src="singer.avatar || singer.image" style="border-radius: 50%; object-fit: cover"
                fit="cover">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div class="musicForm-info" style="display: flex; flex-direction: column; margin-left: 10px">
        <span>{{ singer.name }}</span>
        <span>歌手</span>
      </div>
      <div></div>
    </template>
    <template v-if="album">
      <el-image class="image" :src="album.image">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div class="musicForm-info" style="display: flex; flex-direction: column; margin-left: 10px">
        <span>{{ album.name }}</span>
        <span>专辑·{{ album.singerName }}</span>
      </div>
      <div></div>
    </template>
  </el-skeleton>
</template>

<style scoped lang="less">
.musicForm {
  width: 100%;
  padding: 6px 6px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 2px;

  &:hover {
    background-color: #E4E7ED;
    transition: background-color .2s linear;
  }

  .musicForm-loading {
    display: flex;
    align-items: center;
  }

  .image {
    border-radius: 5px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .musicForm-info {
    width: 100px;
    margin-left: 10px;
    display: inline-flex;
    flex-direction: column;

    span:nth-child(2) {
      margin-top: 3px;
      font-size: 13px;
    }
  }
}
</style>
