<script>
import { getAlbumById } from '@/api/album'
// import ColorThief from 'colorthief'
import { mapMutations } from 'vuex'
import ActionBar from '@/components/layout/ActionBar.vue'
import MusicItem from '@/components/bolck/MusicItem.vue'
import Header from '@/components/layout/Header.vue'
export default {
  name: 'albumDetail',
  components: {
    ActionBar, MusicItem, Header
  },
  activated () {
    this.getAlbumById(this.getAlbumId)
  },
  data () {
    return {
      album: {
        image: '',
        singerName: ''
      },
      backgroundColor: [],
      musicList: []
    }
  },
  methods: {
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList']),
    // 页面滚动顶栏变色
    async getAlbumById (id) {
      await getAlbumById(id).then(res => {
        this.album = res.data
        this.musicList = res.data.musicList

        // this.$refs.image.crossOrigin = 'anonymous'
        // this.$refs.image.src = this.album.image + '?time=' + new Date().valueOf()
      })
    },
    submitPlay () {
      this.setPlayList(this.musicList)
    }
  },
  created () {
    this.getAlbumById(this.getAlbumId)
  },
  computed: {
    getAlbumId () {
      return this.$route.params.id
    }
  }
}
</script>

<template>
  <div class="album">
    <Header :color="album.color">
      <p>{{album.name}}</p>
    </Header>
    <div class="head">
      <div class="background-color" :style="{'background-color': album.color }"></div>
      <div class="background-color shade"></div>
      <el-image ref="image" style="min-width: 225px; min-height: 225px;"  class="img" :src="this.album.image + '?time=' + new Date().valueOf()" alt="">
        <div slot="placeholder" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
          <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
        </div>
        <div slot="error" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
          <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
        </div>
      </el-image>
      <div class="album-detail">
        <span>专辑</span>
        <span style="font-size: 5rem; font-weight: bold">{{album.name}}</span>
        <span>{{album.singerName}}</span>
      </div>
    </div>
    <div class="gradual-block" :style="{'background-color': album.color }"></div>
    <div class="album-plank">
      <ActionBar
        @submitPlay="submitPlay"
      />
    </div>
    <div class="musicList">
      <MusicItem v-for="(item, index) in musicList" :key="item.id" :index="index+1" :music="item"></MusicItem>
    </div>
  </div>
</template>

<style scoped lang="less">
.album{
  position: relative;
  z-index: 1;
  overflow: hidden;
  height: 100%;
  .head{
    height: 53vh;
    min-height: 330px;
    max-height: 400px;
    width: 100%;
    padding: 0 0 20px 20px;
    display: flex;
    align-items: flex-end;
    z-index: 0;
    position: relative;
    .shade{
      z-index: 1;
      background-image: linear-gradient(transparent 0, rgba(0, 0, 0, .3) 100%);
    }
    .background-color{
      z-index: -1;
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .img{
      z-index: 10;
      width: 14rem;
      height: 14rem;
      //min-width: 180px;
      //min-height: 180px;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 4px 60px rgba(0, 0, 0, .5);
      &:hover{
        transform: scale(1.01);
        transition: transform 0.1s ease-out;
      }
    }
    .album-detail{
      margin-left: 20px;
      display: flex;
      align-content: space-between;
      flex-direction: column;
      span{
        color: #ffffff;
      }
    }
  }
  .gradual-block{
    //position: relative;
    z-index: 1;
    float: left;
    width: 100%;
    height: 530px;
    background-image: linear-gradient(rgba(0, 0, 0, .4) 0, #ffffff 100%);
  }
  .album-plank{
    display: flex;
    align-items: center;
    width: 100%;
    z-index: 10;
    height: 5rem;
    position: absolute;
  }
  .musicList{
    width: 100%;
    height: 30rem;
    padding: 0 20px 0 20px;
    position: absolute;
    margin-top: 5rem;
    //bottom: 5rem;
    z-index: 10;
  }
}
</style>
