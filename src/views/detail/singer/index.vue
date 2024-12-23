<script>
import MusicItem from '@/components/block/MusicItem.vue'
import Block from '@/components/block/Block.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import Header from '@/components/layout/Header.vue'
import { findSingerById } from '@/api/singer'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { useContextMenu } from '@/utils/useContextMenu'
import ActionBar from '@/components/layout/ActionBar.vue'
import { collect, unfollow } from '@/api/collect'
import ReplyInput from '@/components/block/replyInput.vue'
import Reply from '@/components/block/reply.vue'
import { moreComment, saveComment, select } from '@/api/comment'
import { likeApi, unlikeApi } from '@/api/support'

export default {
  name: 'singerDetail',
  computed: {
    ...mapState('comment', ['content', 'replyUserId', 'rootId', 'parent']),
    ...mapGetters('collect', ['getUserMusicForm', 'isSingerCollect']),
    //  获取路由 歌手id
    getSingerId () { return +this.$route.params.id },
    isLogin () { return this.$store.getters.token }
  },
  components: {
    Reply,
    ReplyInput,
    ActionBar,
    MusicItem,
    Block,
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
    this.getSinger()
    this.getComment()
  },
  mounted () {
    // 将会话中的歌单数据赋值给菜单
    this.menu[0].menu = this.getUserMusicForm
  },
  methods: {
    ...mapActions('collect', ['getCollectForm']),
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList']),
    ...mapMutations('comment', ['setContent']),
    ...mapMutations('player', ['setStatus']),
    ...mapActions('comment', ['clear']),
    ...mapActions('player', ['playSong']),
    // 获取评论
    async getComment () {
      const { data } = await select({
        objId: +this.$route.params.id,
        objType: 1,
        id: 0
      })
      this.reply = data.comment
      this.total = data.count
    },
    // 提交评论
    async submit () {
      await saveComment({
        ...this.comment,
        replyUserId: this.replyUserId,
        root: this.rootId,
        parent: this.parent,
        content: this.content
      })
      await this.clear()
    },
    async more ({ pagination, objId, rootId }) {
      const { data } = await moreComment({ ...pagination, objId: objId, objType: 1, rootId: rootId })
      const find = this.reply.find(item => item.id === rootId)
      if (find) { find.children = data.page }
    },
    handleScroll () {
      // 获取滚动距离
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      const maxScroll = 100 // 设置滚动的最大位置
      const opacity = Math.min(1, scrollTop / maxScroll) // 计算透明度，最大不超过1
      // 设置颜色和透明度
      this.$refs.background.style.backgroundColor = this.singer.color
      this.$refs.background.style.opacity = opacity.toString()
    },
    // 根据id查询歌手
    async getSinger () {
      const { data } = await findSingerById(this.getSingerId)
      if (data == null) return
      this.singer = data
      this.musicList = data.musicList
      this.albumList = data.albumList
      this.loading = false
    },
    // 右键选中的选项
    pickMenu (e) {
      useContextMenu(e, this.pickMusicItem, this.getSingerId)
    },
    // 提交播放数据
    submitPlay () {
      this.setPlayList(this.musicList)
      this.playSong(this.musicList[0])
    },
    // 关注
    async attention () {
      await collect(1, this.getSingerId)
      await this.getCollectForm()
      this.isSingerCollect(this.getSingerId)
    },
    // 取消关注
    async unfollow () {
      await unfollow(1, this.getSingerId)
      await this.getCollectForm()
      this.isSingerCollect(this.getSingerId)
    },
    // 点赞
    async like ({ objId, objUserId }) {
      await likeApi({ objId, objType: 1, objUserId, likeTimestamp: new Date(), likeAction: 1 })
    },
    // 取消点赞
    async unlike ({ objId, objUserId }) {
      await unlikeApi({ objId, objType: 1, objUserId, likeTimestamp: new Date(), likeAction: 2 })
    }
  },
  data () {
    return {
      // 评论条数
      total: '',
      // 评论
      reply: {},
      menu: [
        {
          id: 1,
          label: '加入歌单',
          icon: 'el-icon-folder-checked',
          menu: []
        },
        {
          id: 2,
          label: '加入队列',
          icon: 'el-icon-menu'
        },
        {
          id: 5,
          label: '分享给好友',
          icon: 'el-icon-info'
        }
      ],
      isExist: '',
      // 歌手信息
      singer: {},
      // 歌手
      musicList: [],
      // 专辑
      albumList: [],
      // 控制音乐渲染数量
      controlMusicNumber: 5,
      // 加载
      loading: false,
      // 选中的歌曲
      pickMusicItem: {},
      // MusicItem组件点击省略号时间
      position: {},
      isReply: true,
      comment: {
        objId: +this.$route.params.id,
        objType: 1,
        userId: this.$store.state.user.userInfo.id,
        root: 0,
        parent: 0
      }
    }
  }
}
</script>

<template>
  <div class="detail" v-loading="loading" v-title data-title="歌手详情">
    <Header :color="singer.color">
      <p>{{ singer.name }}</p>
    </Header>
    <div class="main">
      <div class="background">
        <div class="public">
          <el-image
            ref="image"
            class="background-img"
            :src="singer.image"
            alt=""/>
          <!--          <img class="background-img" crossorigin="anonymous" alt="" ref="image" :src="this.singer.image  + '?time=' + new Date().valueOf()"/>-->
        </div>
        <div class="background-black public" ref="background"></div>
        <div class="cont-info">
          <span></span>
          <span>
            <i class="name">{{ singer.name }}</i>
          </span>
          <span class="count">每月有 1,697,783 名听众</span>
        </div>
      </div>
      <div class="content">
        <div class="cont-center">
          <div class="background-active"
               :style="{'background-color': singer.color}">
          </div>
          <div class="cont-works">
            <ActionBar
              @submitPlay="submitPlay"
              @attention="attention"
              @unfollow="unfollow"
              :is-exist="this.isSingerCollect(this.getSingerId)"
            >
              <span @click="isReply = !isReply" style="fill: #aaaaaa; min-width: 40px; min-height: 40px;">
                <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path
                  d="M853.333333 768c35.413333 0 64-20.650667 64-55.978667V170.581333A63.978667 63.978667 0 0 0 853.333333 106.666667H170.666667C135.253333 106.666667 106.666667 135.253333 106.666667 170.581333v541.44C106.666667 747.285333 135.338667 768 170.666667 768h201.173333l110.016 117.44a42.752 42.752 0 0 0 60.586667 0.042667L651.904 768H853.333333z m-219.029333-42.666667h-6.250667l-115.797333 129.962667c-0.106667 0.106667-116.010667-129.962667-116.010667-129.962667H170.666667c-11.776 0-21.333333-1.621333-21.333334-13.312V170.581333A21.205333 21.205333 0 0 1 170.666667 149.333333h682.666666c11.776 0 21.333333 9.536 21.333334 21.248v541.44c0 11.754667-9.472 13.312-21.333334 13.312H634.304zM341.333333 490.666667a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z"></path></svg>
              </span>
            </ActionBar>
            <div v-if="isReply"
                 style="min-height: 300px; display: flex; flex-wrap: wrap; flex-direction: column; margin: 0 20px 0 20px;">
              <div v-if="musicList.length > 0" class="cont-hot-music">
                <h2 class="title">热门</h2>
                <div class="target">
                  <ContextMenu
                    :menu="menu"
                    :position="position"
                    @select-menu="pickMenu"
                  >
                    <MusicItem
                      v-for="(item,index) in musicList.slice(0, this.controlMusicNumber)"
                      @select-music="pickMusicItem = $event"
                      @position="position = $event"
                      :key="item.id"
                      :music="item"
                      :index="index+1"
                      :backup="singer?.avatar"
                    />
                  </ContextMenu>
                </div>
                <div class="more">
                  <span v-if="controlMusicNumber === 5" @click="controlMusicNumber = 10">查看更多</span>
                  <span v-else @click="controlMusicNumber = 5">收起</span>
                </div>
              </div>
              <div v-if="albumList.length > 0" class="album" style="padding-bottom: 10px">
                <h2 class="title">唱片专辑</h2>
                <div class="target">
                  <!--                  <Block v-for="item in albumList" :key="item.id" :album="item"></Block>-->
                  <Block v-for="item in albumList" :key="item.id">
                    <template #img>
                      <el-image
                        :src="item.avatar || item.image"
                        style="width: 100%;
                        height: 100%;
                        cursor: pointer;
                        border-radius: 3%;"
                        fit="cover"
                        :lazy="true"
                        alt=""
                        @click="$router.push(`/detail/album/${item.id}`)"
                      ></el-image>
                    </template>
                    <template #nameOne>
                      <i @click="$router.push(`/detail/album/${item.id}`)">
                        {{ item.name }}
                      </i>
                    </template>
                    <template #nameTwo>
                      专辑
                    </template>
                  </Block>
                </div>
              </div>
              <div class="cont-introduce">
              </div>
            </div>
            <div style="min-height: 300px;" v-if="!isReply" class="replyView">
              <ul class="nav-bar">
                <li class="nav-title">
                  <span class="title-text">评论</span>
                  <span class="total-reply">{{ total }}</span>
                </li>
                <li></li>
              </ul>
              <ReplyInput @sub="submit" @focus="clear"></ReplyInput>
              <Reply
                v-for="item in reply"
                :key=" 'singer' + item.id"
                :item="item"
                @more="more"
                @submit="submit"
                @like="like"
                @unlike="unlike"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  margin-bottom: 10px;
}
.detail {
  position: relative;
  padding-bottom: 40px;
  .main {
    overflow: hidden;
    .background {
      min-height: 40vh;
      position: relative;
      width: 100%;
      .public {
        height: 40vh;
        width: 100%;
        position: absolute;
        top: 0;
        ::v-deep .background-img {
          height: 100%;
          width: 100%;
          img {
            height: 100%;
            width: 100%;
            z-index: -5;
            object-position: 50% 15%;
            object-fit: cover;
          }
        }
      }
      .background-black {
        //background: linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%);
      }
      .cont-info {
        position: absolute;
        bottom: 1rem;
        display: flex;
        flex-direction: column;
        color: var(--info-text);
        margin: 0 20px;
        z-index: 100;
        span {
          font-size: 2rem;
          .name {
            color: var(--info-text);
            font-size: 10rem;
          }
        }
        .count {
          margin-left: 0.8vw;
          font-size: 1rem;
        }
      }
    }
    .content {
      min-height: calc(100vh - 40vh - 100px);
      .cont-center {
        width: 100%;
        position: relative;
        top: 0;
        .background-active {
          //background: linear-gradient(transparent 0, rgba(0, 0, 0, .5) 100%);
          //background-image: linear-gradient(rgba(198, 197, 197, 0.4) 40%, #ffffff 100%);
          background-image: linear-gradient(rgba(198, 197, 197, 0) 40%, var(--main-background-color) 100%);
          min-height: 50vh;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 2;
        }
        .cont-works {
          min-height: 40vh;
          position: relative;
          top: 1vh;
          z-index: 100;
          .cont-hot-music {
            position: relative;
            width: 70rem;
            margin-bottom: 20px;
            .dark {
              color: black;
            }
            h2 {
              color: var(--text-color);
            }
            .target {
              display: flex;
              flex-wrap: wrap;
              width: 100%
            }
            .more {
              z-index: 10;
              display: inline-block;
              color: #696969;
              margin-top: 1.5rem;
              &:hover {
                color: black;
              }
            }
          }
          .album {
            .target {
              display: flex;
              flex-wrap: wrap;
            }
          }
          .cont-introduce {
            width: 20rem;
            .introduce-target {
              .el-card {
                width: 450px;
                height: 300px;
                z-index: 5;
                .img {
                  width: 100%;
                  height: 100%;
                  .i {
                    position: relative;
                    z-index: 100;
                  }
                }
              }
            }
            .dark {
              color: var(--text-color);
            }
            h2 {
              white-space: nowrap;
              color: #ffffff;
            }
          }
          .replyView {
            width: 100%;
            height: 100%;
            padding: 0 40px 0 40px;
            position: relative;
            top: -80px;
            margin-top: 5rem;
            z-index: -1;
            .nav-bar {
              margin-bottom: 10px;
              .nav-title {
                font-size: 20px;
                color: var(--text-color);
                .title-text {
                  margin-right: 5px;
                }
                .total-reply {
                  height: 100%;
                  font-size: 13px;
                }
              }
            }
            .reply-tool {
              padding: 20px 0;
              margin-bottom: 10px;
              display: flex;
              .input {
                .btn-box {
                  display: flex;
                  margin-top: 10px;
                  height: 32px;
                  transition: all .3s ease-in-out;
                  .btn {
                    margin-left: auto;
                  }
                }
                .hide {
                  margin-top: -30px;
                  height: 0;
                  overflow: hidden;
                  transition: all .2s ease-in-out;
                }
              }
            }
          }
        }
      }
    }
  }
}

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .2s ease;
}

.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
