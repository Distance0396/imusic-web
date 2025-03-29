<script>
import MusicItem from '@/components/block/MusicItem.vue'
import Block from '@/components/block/Block.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import Header from '@/components/layout/Header.vue'
import { findSingerById } from '@/api/singer'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ActionBar from '@/components/layout/ActionBar.vue'
import { follow, unfollow } from '@/api/follow'
import ReplyInput from '@/components/block/replyInput.vue'
import Reply from '@/components/block/reply.vue'
import { moreComment, saveComment, select } from '@/api/comment'
import { likeApi, unlikeApi } from '@/api/support'
import { throttle } from 'lodash/function'

export default {
  name: 'singerDetail',
  computed: {
    ...mapState('comment', ['content', 'replyUserId', 'rootId', 'parent']),
    ...mapGetters('user', ['getUserMusicForm', 'isSingerCollect']),
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
    window.removeEventListener('scroll', this.handleScrollBottom)
  },
  created () {
    // 注册滚动事件
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('scroll', this.handleScrollBottom)
    this.getSinger()
    this.getComment()
  },
  mounted () {
    // 将会话中的歌单数据赋值给菜单
    this.menu[0].menu.push(...this.getUserMusicForm)
  },
  methods: {
    ...mapActions('user', ['getCollectForm']),
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList', 'unshiftPlayList', 'appoint']),
    ...mapMutations('comment', ['setContent']),
    ...mapMutations('player', ['setStatus']),
    ...mapActions('comment', ['clear']),
    ...mapActions('player', ['playSong', 'playCol']),
    // 提交评论
    async submit () {
      if (!this.isLogin) return this.$message.error('未登录')
      await saveComment({
        ...this.comment,
        replyUserId: this.replyUserId,
        root: this.rootId,
        parent: this.parent,
        content: this.content
      })
      await this.clear()
    },
    // 更多评论
    async more ({ pagination, objId, rootId }) {
      const { data } = await moreComment({ ...pagination, objId: objId, objType: 1, rootId: rootId })
      const find = this.reply.find(item => item.id === rootId)
      if (find) { find.children = data.page }
    },
    // 滚动处理器
    handleScroll () {
      // 获取滚动距离
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      const maxScroll = 100 // 设置滚动的最大位置
      const opacity = Math.min(1, scrollTop / maxScroll) // 计算透明度，最大不超过1
      // 设置颜色和透明度
      this.$refs.background.style.backgroundColor = this.singer.color
      this.$refs.background.style.opacity = opacity.toString()
      this.$refs.background.style.backgroundImage = 'linear-gradient(var(--gradation-color) 0, rgba(0, 0, 0, 0.4) 0)'
    },
    // 检测页面触底
    handleScrollBottom: throttle(function () {
      if (this.isEnd) return
      if (this.$refs.moreReply) {
        const rect = this.$refs.moreReply.getBoundingClientRect()
        if ((rect.top >= 0 && rect.top <= window.innerHeight) || (rect.bottom >= 0 && rect.bottom <= window.innerHeight)) {
          this.load()
        }
      }
    }, 500),
    // 获取评论
    async getComment () {
      const { data } = await select({
        // 歌手id
        objId: this.getSingerId,
        // 歌手类型为1
        objType: 1,
        id: 0
      })
      this.reply = data.comment
      this.replyLoading = false
      this.isEnd = data.isEnd
      this.total = data.count
    },
    // 加载评论
    async load () {
      if (this.replyLoading) return
      if (this.isEnd) return
      // clearTimeout(this.timeout)
      // this.timeout = setTimeout(async () => {
      this.replyLoading = true
      const { data } = await select({
        objId: +this.$route.params.id,
        objType: 1,
        id: this.reply.slice(-1)[0].id
      })
      this.reply.push(...data.comment)
      this.replyLoading = false
      this.isEnd = data.isEnd
      // }, 1000)
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
      if (!this.isLogin) return this.$message.error('未登录')
      const { menu, sonItem } = e
      this.$useContextMenu({
        menu: menu,
        target: this.selectMusic,
        playList: sonItem?.id
      })
      this.$refs.contextMenu.showMenu = false
    },
    // 右键菜单处理器
    handleSongContextMenu (e, item) {
      /*
        告诉菜单点击的PointerEvent
       */
      this.$refs.contextMenu.handleContextMenu(e)
      this.selectMusic = item
      this.selectMusicId = e.currentTarget.dataset.music
    },
    // 提交播放数据
    submitPlay () {
      this.setPlayList(this.musicList)
      this.playSong(this.musicList[0])
    },
    // 关注
    async attention () {
      if (!this.isLogin) return this.$message.error('未登录')
      await follow(1, this.getSingerId)
      await this.getCollectForm()
      this.isSingerCollect(this.getSingerId)
    },
    // 取消关注
    async unfollow () {
      if (!this.isLogin) return this.$message.error('未登录')
      await unfollow({
        objType: 1,
        objId: this.getSingerId,
        likeTimestamp: this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
      await this.getCollectForm()
      this.isSingerCollect(this.getSingerId)
    },
    // 点赞
    async like ({ objId, objUserId }) {
      await likeApi({
        objId: objId,
        objType: 1,
        objUserId: objUserId,
        likeTimestamp: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        likeAction: 1
      })
    },
    // 取消点赞
    async unlike ({ objId, objUserId }) {
      await unlikeApi({
        objId: objId,
        objType: 1,
        objUserId: objUserId,
        likeTimestamp: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        likeAction: 2
      })
    },
    handleClickMore ({ event, musicId }) {
      this.selectMusicId = musicId
      this.$refs.contextMenu.handleContextMenu(event)
    }
  },
  data () {
    return {
      // 评论条数
      total: '',
      // 评论
      reply: {},
      menu: [
        { id: 1, label: '加入歌单', icon: 'el-icon-folder-checked', menu: [] },
        { id: 2, label: '加入队列', icon: 'el-icon-menu' },
        { id: 5, label: '分享给好友', icon: 'el-icon-info' }
      ],
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
      isReply: true,
      comment: {
        objId: +this.$route.params.id,
        objType: 1,
        userId: this.$store.state.user.userInfo.id,
        root: 0,
        parent: 0
      },
      selectMusicId: null,
      // 选中的歌曲
      selectMusic: null,
      replyLoading: false,
      isEnd: false
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
        <div class="image public" :style="{'backgroundImage':
         `linear-gradient(var(--gradation-color) 0, rgba(0, 0, 0, 0.4) 0),
          url(${singer.image})`}">
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
          <div class="background-active" :style="{'background-color': singer.color}">
          </div>
          <div class="cont-works">
            <ActionBar
              @submitPlay="submitPlay"
              @follow="attention"
              @unfollow="unfollow"
              :isShowFollow="true"
              :isFollow="isSingerCollect(this.getSingerId)"
            >
              <span @click="isReply = !isReply" style="color: #aaaaaa; ">
                <i class="iconfont icon-wodewenzhang icon" style="font-size: 40px;"></i>
              </span>
            </ActionBar>
            <div v-if="isReply" style="min-height: 300px; display: flex; flex-wrap: wrap; flex-direction: column; margin: 0 20px 0 20px;">
              <div v-if="musicList.length > 0" class="cont-hot-music">
                <h2 class="title">热门</h2>
                <div class="target">
                  <ContextMenu
                    @select-menu="pickMenu"
                    ref="contextMenu"
                    :menu="menu"
                  >
                    <MusicItem
                      v-for="(item, index) in musicList.slice(0, this.controlMusicNumber)"
                      :key="item.id"
                      :index="index+1"
                      :music="item"
                      :backup="singer?.avatar"
                      :data-music="item.id"
                      :class="{ active : selectMusicId == item.id }"
                      @click-more="handleClickMore"
                      @contextmenu.native="handleSongContextMenu($event, item)"
                    />
                    <template #menu-info>
                      <div style="padding: 5px; display: flex; align-items: center;">
                        <div style="min-width: 40px; height: 40px; border-radius: 3px; overflow: hidden;">
                          <img style="width: 100%; height: 100%;" :src="selectMusic?.image || singer?.avatar"  alt=""/>
                        </div>
                        <div style="display: flex; flex-direction: column; margin-left: 10px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                          <span>{{selectMusic?.name}}</span>
                          <span>{{selectMusic?.singerName}}</span>
                        </div>
                      </div>
                    </template>
                  </ContextMenu>
                </div>
                <div class="more">
                  <span v-if="controlMusicNumber === 5" @click="controlMusicNumber = 10">查看更多</span>
                  <span v-else @click="controlMusicNumber = 5">收起</span>
                </div>
              </div>
              <div v-if="albumList.length > 0" class="album" style="padding-bottom: 10px">
                <h2 class="title" style="color: var(--text-color)">唱片专辑</h2>
                <div class="target">
                  <Block v-for="item in albumList" :key="item.id" :is-loading="false">
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
                        @click="$router.push(`/album/${item.id}`)"
                      />
                    </template>
                    <template #nameOne>
                      <i @click="$router.push(`/album/${item.id}`)">
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
            <div v-else-if="!isReply" style="min-height: 300px;"  class="replyView">
              <ul class="nav-bar">
                <li class="nav-title">
                  <span class="title-text">评论</span>
                  <span class="total-reply">{{ total }}</span>
                </li>
              </ul>
              <ReplyInput @sub="submit" @focus="clear"></ReplyInput>
              <Reply
                v-for="item in reply"
                :key=" 'singer' + item.id"
                :item="item"
                :obj-id="comment.objId"
                :obj-type="comment.objType"
                @submit="submit"
                @like="like"
                @unlike="unlike"
              />
              <p ref="moreReply" style="text-align: center; color: var(--text-color); height: 100px;">
                <i v-show="replyLoading" class="loader"></i>
                <i v-show="isEnd" class="end"></i>
              </p>
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
  .main {
    overflow: hidden;
    .background {
      min-height: 40vh;
      position: relative;
      width: 100%;
      //background-image: linear-gradient(var(--gradation-color) 0, rgba(0, 0, 0, 0.4) 0);
      .image{
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
      .public {
        height: 40vh;
        width: 100%;
        position: absolute;
        top: 0;
      }
      .background-black {
        //background-image: linear-gradient(var(--gradation-color) 0, rgba(0, 0, 0, 0.4) 0);
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
      min-height: calc(100vh - 40vh );
      .cont-center {
        width: 100%;
        position: relative;
        top: 0;
        .background-active {
          background-image: linear-gradient(rgba(0, 0, 0, 0.4) 0, var(--gradation-color) 100%);
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
