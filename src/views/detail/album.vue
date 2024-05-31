<script>
import { getAlbumById } from '@/api/album'
import ColorThief from 'colorthief'

export default {
  name: 'albumDetail',
  data () {
    return {
      album: {
        image: ''
      },
      backgroundColor: []
    }
  },
  methods: {
    // 读取图片颜色
    loadImage () {
      const img = new Image()

      const colorThief = new ColorThief()
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = this.album.image + '?time=' + new Date().valueOf()

      setTimeout(() => {
        // const baColor = colorThief.getColor(img)
        const baColor = colorThief.getPalette(img)
        try {
          baColor.forEach(x => {
            if (Number(x[0] * 0.299 + x[1] * 0.587 + x[2] * 0.114) > 100) {
              console.log('小于100 就是深色' + Number(x[0] * 0.299 + x[1] * 0.587 + x[2] * 0.114))
              this.backgroundColor = x
              throw new Error('获取颜色')
            }
          })
        } catch (e) {
        }
        //  小于100 就是深色
        // if (this.backgroundColor[0] * 0.299 + this.backgroundColor[1] * 0.587 + this.backgroundColor[2] * 0.114 > 100) {
        //   console.log('小于100 就是深色' + this.backgroundColor[0] * 0.299 + this.backgroundColor[1] * 0.587 + this.backgroundColor[2] * 0.114)
        //   this.isDark = true
        // }
      }, 500)
    },
    async getAlbumById (id) {
      await getAlbumById(id).then(res => {
        this.album = res.data
        this.album.image = res.data.image + '?time=' + new Date().valueOf()
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
    <div class="background">
      <div class="background-color" :style="{'background-color': 'rgb(' + backgroundColor[0] + ',' + backgroundColor[1] + ', ' +  backgroundColor[2] + ')'}"></div>
      <div class="background-color shade"></div>
      <el-image class="img" :src="album.image"  @load="loadImage" alt="" />
      <div class="album-detail">
        <span>专辑</span>
        <span style="font-size: 5rem; font-weight: bold">{{album.name}}</span>
        <span>{{album.singerName}}</span>
      </div>
    </div>
    <div class="album-plank">
    </div>
  </div>
</template>

<style scoped lang="less">
.album{
  position: relative;
  z-index: 1;
  overflow: hidden;
  .background{
    height: 53vh;
    min-height: 330px;
    max-height: 400px;
    width: 100%;
    padding: 0 0 20px 20px;
    display: flex;
    align-items: flex-end;
    z-index: 0;
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
        transform: scale(1.02);
        transition: all 0.2s;
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
}
</style>
