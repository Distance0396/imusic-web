<script xmlns:crossOrigin="http://www.w3.org/1999/xhtml">
import ColorThief from 'colorthief'
import MusicItem from '@/components/MusicItem.vue'
import BlockItem from '@/components/BlockItem.vue'
import { findSingerById } from '@/api/singer'
import { getAlbumBySingerId } from '@/api/album'
export default {
  name: 'DetailIndex',
  computed: {
    //  获取路由歌手id
    getSingerId () {
      return this.$route.params.id
    }
  },
  components: {
    MusicItem,
    BlockItem
  },
  props: {

  },
  data () {
    return {
      backgroundColor: [],
      isColor: null,
      isDark: false,
      singer: {},
      music: [],
      album: [],
      // 控制音乐渲染数量
      controlMusicNumber: 5
    }
  },
  methods: {
    // 读取图片颜色
    async loadImage () {
      const img = new Image()
      // const img = document.querySelector('.background-img')
      const colorThief = new ColorThief()

      img.setAttribute('crossOrigin', 'anonymous')
      img.src = this.singer.image + '?time=' + new Date().valueOf()

      setTimeout(() => {
        const baColor = colorThief.getColor(img)
        // const baColor = colorThief.getPalette(img)[0]
        console.log('颜色提取' + baColor)
        this.backgroundColor = baColor
      }, 500)
      console.log(this.backgroundColor) // 主颜色
      //  小于100 就是深色
      if (this.backgroundColor[0] * 0.299 + this.backgroundColor[1] * 0.587 + this.backgroundColor[2] * 0.114 > 100) {
        console.log(this.backgroundColor[0] * 0.299 + this.backgroundColor[1] * 0.587 + this.backgroundColor[2] * 0.114)
        this.isDark = true
      }
    },
    // 页面滚动顶栏变色
    handleScroll () {
      // 计算滚动条位置
      const scrollTop = window.scrollX || document.documentElement.scrollTop || document.body.scrollTop
      // 计算绑定div位置
      const offsetTop = document.querySelector('.cont-info .count').offsetTop
      // console.log(offsetTop)
      // 进行比较设置位置fixed
      if (scrollTop > offsetTop) {
        document.querySelector('.header').style.backgroundColor = 'rgb(' + this.backgroundColor[0] + ',' + this.backgroundColor[1] + ', ' + this.backgroundColor[2] + ')'
      } else {
        document.querySelector('.header').style.backgroundColor = '#FFFFFF00'
      }
    },
    // 根据id查询歌手
    async getSinger () {
      const { data } = await findSingerById(this.getSingerId)
      this.singer = data
      this.music = data.musicList
      this.singer.image = this.singer.image + '?time=' + new Date().valueOf()
    },
    // 根据id查询专辑
    async getAlbum () {
      const { data } = await getAlbumBySingerId(this.getSingerId)
      this.album = data
    }
  },
  async created () {
    await this.getSinger()
    await this.getAlbum()
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<template>
  <div class="detail">
<!--    <Header></Header>-->
    <div class="main" >
      <div class="background">
        <div class=" public">
          <el-image class="background-img" fit="cover" :src="singer.image" crossorigin="anonymous" alt="" @load="loadImage" style="width: 100%;"></el-image>
        </div>
        <div class="background-black public"></div>
      </div>
      <div class="content">
        <div class="cont-info">
          <span></span>
          <span>
            <i class="name">{{singer.name}}</i>
          </span>
          <span class="count">每月有 1,697,783 名听众</span>
        </div>
        <div class="cont-center">
          <div class="background-active"
            :style="{'background-color': 'rgb(' + backgroundColor[0] + ',' + backgroundColor[1] + ', ' +  backgroundColor[2] + ')'}">
          </div>
          <div class="cont-works">
            <div class="follow-play">
              <span class="play">
                <svg class="icon" viewBox="0 0 1024 1024"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path
                  d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z"
                  ></path>
                </svg>
              </span>
              <span class="follow">
                <i>关注</i>
              </span>
            </div>
            <div style="display: flex; flex-wrap: wrap; flex-direction: column">
              <div class="cont-hot-music">
                <h2 :class="{dark : this.isDark}" class="title">热门</h2>
                <div class="target">
                  <MusicItem v-for="(item,index) in music.slice(0,this.controlMusicNumber)" :key="item" :music="item" :index="index+1" :avatar="singer.avatar"></MusicItem>
                </div>
                <div class="more" >
                  <span v-if="controlMusicNumber === 5" @click="controlMusicNumber = 10">查看更多</span>
                  <span v-else @click="controlMusicNumber = 5">收起</span>
                </div>
              </div>
              <div class="cont-album">
                <h2 class="title">唱片专辑</h2>
                <div class="target">
                  <BlockItem v-for="item in album" :key="item.id" :detail="item"></BlockItem>
                </div>
              </div>
              <div class="cont-introduce">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.title{
  margin-bottom: 10px;
  margin-top: 40px;
}
.detail {
  position: relative;
  width: 100%;
  //max-width: 1500px;
  overflow: hidden;
  margin-bottom: 40px;
  .main {
    position: relative;
    width: 100%;
    .background {
      height: 40vh;
      max-height: 700px;
      width: 100%;
      .public {
        height: 40vh;
        width: 100%;
        position: absolute;
        top: 0;
        .background-img {
          height: 100%;
          width: 100%;
          object-position: 50% 15%;
          object-fit: cover;
          z-index: -5;
        }
      }
      .background-black {
        z-index: 0;
        background: linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%);
      }
    }

    .content {
      height: 100%;
      .cont-info {
        position: absolute;
        display: flex;
        top: 2rem;
        flex-direction: column;
        color: #ffffff;
        overflow: hidden;
        margin: 5vh 20px 0;
        z-index: 0;
        span {
          font-size: 2vh;
          .name {
            color: #ffffff;
            z-index: -4;
            font-size: 7rem;
          }
        }
        .count{
          font-size: 1rem;
        }
      }

      .cont-center {
        width: 100%;
        position: relative;
        top: 0;

        .background-active {
          background-image: linear-gradient(rgba(198, 197, 197, 0.4) 40%, #ffffff 100%);
          height: 40vh;
          max-height: 400px;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 2;
        }
        .cont-works{
          position: relative;
          top: 1vh;
          z-index: 100;
          margin: 0 20px;
          .follow-play {
            position: relative;
            z-index: 2;
            top: 1.5rem;
            display: flex;
            align-items: center;
            width: 100%;
            .play {
              fill: #ffffff;
              display: flex;
              width: 56px;
              height: 56px;
              border-radius: 50%;
              //opacity: .8;
              background-color: #2e6aff;
              justify-content: center;
              align-items: center;
              margin-right: 20px;
            }

            .play:hover {
              background-color: #004dff;
              transition: background-color .3s;
            }

            .follow {
              font-size: 2vh;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 56px;
              height: 32px;
              border-radius: 15px;
              border: 1px solid #121212;
              i{
                font-size: 15px;
              }
            }
          }
          h2{
            mix-blend-mode: difference;
            font-size: 1.5rem;
          }
          .cont-hot-music{
            position: relative;
            margin-right: 20px;
            width: 70rem;
            .dark{
              color: black;
            }
            h2{
              color: #ffffff;
            }
            .target{
              width: 100%
            }
            .more{
              z-index: 10;
              display: inline-block;
              color: #696969;
              margin-top: 1.5rem;
              &:hover{
                color: black;
              }
            }
          }
          .cont-introduce{
            width: 20rem;
            .introduce-target{
              .el-card{
                width: 450px;
                height: 300px;
                z-index: 5;
                .img{
                  width: 100%;
                  height: 100%;
                  .i{
                    position: relative;
                    z-index: 100;
                  }
                }
              }
            }
            .dark{
              color: black;
            }
            h2{
              white-space:nowrap;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}
</style>
