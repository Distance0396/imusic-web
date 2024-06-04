<script>
import { getAlbumById } from '@/api/album'
import ColorThief from 'colorthief'
import ActionBar from '@/components/layout/ActionBar.vue'
import MusicItem from '@/components/bolck/MusicItem.vue'
export default {
  name: 'albumDetail',
  components: {
    ActionBar, MusicItem
  },
  data () {
    return {
      album: {
        image: ''
      },
      backgroundColor: [],
      musicList: []
    }
  },
  methods: {
    // 读取图片颜色
    loadImage () {
      const colorThief = new ColorThief()
      // const baColor = colorThief.getColor(this.$refs.image)
      const baColor = colorThief.getPalette(this.$refs.image)
      try {
        baColor.forEach(x => {
          if (Number(x[0] * 0.299 + x[1] * 0.587 + x[2] * 0.114) > 140 && Number(x[0] * 0.299 + x[1] * 0.587 + x[2] * 0.114) < 160) {
            // console.log('小于100 就是深色' + Number(x[0] * 0.299 + x[1] * 0.587 + x[2] * 0.114))
            this.backgroundColor = x
            throw new Error('获取颜色')
          }
        })
      } catch (e) {}
    },
    async getAlbumById (id) {
      await getAlbumById(id).then(res => {
        this.album = res.data
        this.musicList = res.data.musicList

        this.$refs.image.crossOrigin = 'anonymous'
        this.$refs.image.src = this.album.image + '?time=' + new Date().valueOf()
      })
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
    <div class="head">
      <div class="background-color" :style="{'background-color': 'rgb(' + backgroundColor[0] + ',' + backgroundColor[1] + ', ' +  backgroundColor[2] + ')'}"></div>
      <div class="background-color shade"></div>
      <img ref="image" class="img" src=""  @load="loadImage" alt="" />
      <div class="album-detail">
        <span>专辑</span>
        <span style="font-size: 5rem; font-weight: bold">{{album.name}}</span>
        <span>{{album.singerName}}</span>
      </div>
    </div>
    <div class="gradual-block" :style="{'background-color': 'rgb(' + backgroundColor[0] + ',' + backgroundColor[1] + ', ' +  backgroundColor[2] + ')'}"></div>
    <div class="album-plank">
      <ActionBar></ActionBar>
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
      min-width: 180px;
      min-height: 180px;
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
