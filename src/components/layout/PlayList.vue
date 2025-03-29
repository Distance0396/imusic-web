<script>
import { mapState, mapGetters } from 'vuex'
import MusicItem from '@/components/block/MusicItem.vue'
export default {
  name: 'playList',
  components: {
    MusicItem,
  },
  computed: {
    ...mapState('playlist', ['playlist']),
    ...mapGetters('playlist', ['firstPlayList']),
  },
}
</script>

<template>
  <div class="playList">
    <div class="main" style="color: var(--text-color)">
      <h2>队列</h2>
      <div class="be-play">
        <i class="title">当前播放</i>
        <MusicItem :music="firstPlayList"></MusicItem>
      </div>
      <div>
        <i class="title">
          下一首来自：
          <i @click="$router.push(`/album/${playlist[0].albumId}`)">
            {{ playlist[0]?.albumName }}
          </i>
        </i>
        <MusicItem
          v-for="(item, index) in playlist"
          :key="item.id"
          :music="item"
          :index="index + 1"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playList::-webkit-scrollbar {
  display: none;
}
.playList:hover::-webkit-scrollbar {
  display: block;
}
.playList {
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  .main {
    padding: 40px 20px 120px 20px;
    .be-play {
      margin-top: 15px;
    }
    .title {
      color: #b3b3b3;
    }
  }
}
</style>
