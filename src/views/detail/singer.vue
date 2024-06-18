<script>
// import ColorThief from 'colorthief'
import MusicItem from '@/components/bolck/MusicItem.vue'
import BlockItem from '@/components/bolck/BlockItem.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import Header from '@/components/layout/Header.vue'
import { findSingerById } from '@/api/singer'
import { mapMutations, mapState } from 'vuex'
import { useContextMenu } from '@/utils/useContextMenu'
import ActionBar from '@/components/layout/ActionBar.vue'

export default {
  name: 'singerDetail',
  computed: {
    //  获取路由歌手id
    getSingerId () {
      return this.$route.params.id
    },
    ...mapState('music', ['musicFormList'])
  },
  components: {
    ActionBar,
    MusicItem,
    BlockItem,
    ContextMenu,
    Header
  },
  beforeDestroy () {
    // 关闭滚动事件
    window.removeEventListener('scroll', this.handleScroll)
  },
  created () {
    // 注册滚动事件
    window.addEventListener('scroll', this.handleScroll)
    //
    this.getSinger()
    setTimeout(() => {
      this.loading = false
    }, 1000)
  },
  mounted () {
    // 将会话中的歌单数据赋值
    this.menu[0].menu = this.musicFormList
  },
  methods: {
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList']),
    handleScroll () {
      // 获取滚动距离
      const scrollTop = window.scrollX || document.documentElement.scrollTop || document.body.scrollTop
      const maxScroll = 100 // 设置滚动的最大位置
      const opacity = Math.min(1, scrollTop / maxScroll) // 计算透明度，最大不超过1
      // 给膜层设置颜色和透明度
      this.$refs.background.style.backgroundColor = this.singer.color
      this.$refs.background.style.opacity = opacity.toString()
    },
    // 根据id查询歌手
    async getSinger () {
      await findSingerById(this.getSingerId).then(res => {
        this.singer = res.data
        this.musicList = res.data.musicList
        this.albumList = res.data.albumList

        this.$refs.image.crossOrigin = 'anonymous'
        this.$refs.image.src = this.singer.image + '?time=' + new Date().valueOf()
      })
    },
    // 选中的选项
    pickMenu (e) {
      useContextMenu(e, this.pickMusicItem)
    },
    submitPlay () {
      this.setPlayList(this.musicList)
    }
  },
  data () {
    return {
      menu: [
        {
          id: 1,
          label: '加入歌单',
          icon: 'el-icon-folder-checked',
          menu: []
        },
        { id: 2, label: '加入队列', icon: 'el-icon-menu' },
        // { id: 3, label: '删除', icon: 'el-icon-delete' },
        { id: 4, label: '跳转至歌手', icon: 'el-icon-s-promotion' },
        { id: 5, label: '分享给好友', icon: 'el-icon-info' }
      ],
      // 背景渐变
      backgroundColor: [],
      isDark: false,
      // 歌手信息
      singer: {},
      // 歌手
      musicList: [],
      // 专辑
      albumList: [],
      // 控制音乐渲染数量
      controlMusicNumber: 5,
      // 加载
      loading: true,
      // 选中的歌曲
      pickMusicItem: {}
    }
  }
}
</script>

<template>
  <div class="detail" v-loading="loading">
    <Header :color="singer.color">
      <p>{{singer.name}}</p>
    </Header>
    <div class="main">
      <div class="background">
        <div class="public">
          <img class="background-img" alt="" ref="image" src=""/>
        </div>
        <div class="background-black public" ref="background" ></div>
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
            :style="{'background-color': singer.color}">
          </div>
          <div class="cont-works">
            <ActionBar
              @submitPlay="submitPlay"
            />
            <div style="display: flex; flex-wrap: wrap; flex-direction: column; margin: 0 20px 0 20px;">
              <div class="cont-hot-music">
                <h2 :class="{dark : this.isDark}" class="title">热门</h2>
                  <ContextMenu
                    :menu="menu"
                    @select="pickMenu"
                  >
                    <div class="target">
                      <MusicItem
                        v-for="(item,index) in musicList.slice(0,this.controlMusicNumber)"
                        @select="pickMusicItem = $event"
                        :key="item.id"
                        :music="item"
                        :index="index+1"
                      />
                    </div>
                  </ContextMenu>
                <div class="more" >
                  <span v-if="controlMusicNumber === 5" @click="controlMusicNumber = 10">查看更多</span>
                  <span v-else @click="controlMusicNumber = 5">收起</span>
                </div>
              </div>
              <div class="cont-album">
                <h2 class="title">唱片专辑</h2>
                <div class="target">
                  <BlockItem v-for="item in albumList" :key="item.id" :album="item"></BlockItem>
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
  //margin-top: 40px;
}
.detail {
  position: relative;
  width: 100%;
  //max-width: 1500px;
  overflow: hidden;
  margin-bottom: 40px;
  .main {
    //position: relative;
    //width: 100%;
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
          z-index: -5;
          object-position: 50% 15%;
          object-fit: cover;
        }
      }
      .background-black {
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
          //margin: 0 20px;
          //padding: 0 20px 0 20px;
          //.follow-play {
          //  position: relative;
          //  z-index: 2;
          //  top: 1.5rem;
          //  display: flex;
          //  align-items: center;
          //  width: 100%;
          //  .play {
          //    fill: #ffffff;
          //    display: flex;
          //    width: 56px;
          //    height: 56px;
          //    border-radius: 50%;
          //    //opacity: .8;
          //    background-color: #2e6aff;
          //    justify-content: center;
          //    align-items: center;
          //    margin-right: 20px;
          //  }
          //
          //  .play:hover {
          //    background-color: #004dff;
          //    transition: background-color .3s;
          //  }
          //
          //  .follow {
          //    font-size: 2vh;
          //    display: flex;
          //    align-items: center;
          //    justify-content: center;
          //    width: 56px;
          //    height: 32px;
          //    border-radius: 15px;
          //    border: 1px solid #121212;
          //    i{
          //      font-size: 15px;
          //    }
          //  }
          //}
          //h2{
          //  mix-blend-mode: difference;
          //  font-size: 1.5rem;
          //}
          .cont-hot-music{
            position: relative;
            width: 70rem;
            margin-bottom: 20px;
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
