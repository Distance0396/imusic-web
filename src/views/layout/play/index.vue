<script>
import Header from '@/components/layout/Header.vue'
import { mapState, mapGetters } from 'vuex'
import MusicItem from '@/components/bolck/MusicItem.vue'
export default {
  name: 'playList',
  components: {
    Header, MusicItem
  },
  computed: {
    ...mapState('playlist', ['playlist']),
    ...mapGetters('playlist', ['firstPlayList'])
  }
}
</script>

<template>
  <div class="playList" v-title data-title="播放队列">
    <Header></Header>
    <div class="main">
      <h2>队列</h2>
      <div class="be-play">
        <i class="title">当前播放</i>
        <MusicItem :music="firstPlayList"></MusicItem>
      </div>
      <div>
        <i class="title">下一首来自：<i @click="$router.push(`/detail/album/${playlist[0].albumId}`)">{{playlist[0].albumName}}</i></i>
        <MusicItem
          v-for="(item,index) in playlist"
          :key="item.id"
          :music="item"
          :index="index+1"
        ></MusicItem>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playList{
  .main{
    padding: 60px 20px 20px 20px;
    .be-play{
      margin-top: 15px;
    }
    .title{
      color: #b3b3b3;
    }
  }
}
</style>
