<script>
import Reply from '@/components/block/reply.vue'
import ActionBar from '@/components/layout/ActionBar.vue'
import MusicItem from '@/components/block/MusicItem.vue'
import Header from '@/layout/header/Header.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import ReplyInput from '@/components/block/replyInput.vue'
import { getAlbumById } from '@/api/album'
import { follow, unfollow } from '@/api/follow'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { moreComment, saveComment, select } from '@/api/comment'
import { likeApi, unlikeApi } from '@/api/support'
import { throttle } from 'lodash/function'

export default {
  name: 'albumDetail',
  components: {
    ContextMenu,
    ActionBar,
    MusicItem,
    Header,
    Reply,
    ReplyInput,
  },
  data() {
    return {
      menu: [
        {
          id: 1,
          label: '加入歌单',
          icon: 'el-icon-folder-checked',
          menu: [],
        },
        {
          id: 2,
          label: '加入队列',
          icon: 'el-icon-menu',
        },
        {
          id: 4,
          label: '跳转至歌手',
          icon: 'el-icon-s-promotion',
        },
        {
          id: 5,
          label: '分享给好友',
          icon: 'el-icon-info',
        },
      ],
      album: {
        image: '',
        singerName: '',
      },
      musicList: [],
      // 是否显示评论
      isReply: true,
      // // 评论条数
      total: '',
      // // 评论
      reply: [],
      comment: {
        objId: +this.$route.params.id,
        objType: 2,
        userId: this.$store.state.user.userInfo.id,
        root: 0,
        parent: 0,
        // content: ''
      },
      loading: true,
      replyLoading: false,
      timeout: null,
      isEnd: false,
      selectMusicId: null,
      // 选中的歌曲
      selectMusic: null,
    }
  },
  methods: {
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList']),
    ...mapMutations('comment', ['setRootId']),
    ...mapActions('user', ['getCollectForm']),
    ...mapActions('comment', ['updateCommentProperty', 'clear']),
    // 获取专辑
    async getAlbumById() {
      const { data } = await getAlbumById(this.getAlbumId)
      if (data == null) return

      this.album = data
      this.musicList = data.musicList
      this.loading = false
    },
    submitPlay() {
      this.setPlayList(this.musicList)
    },
    // 关注
    async attention() {
      await follow(2, this.getAlbumId).then(res => {
        this.getCollectForm()
        this.isAlbumCollect(this.getAlbumId)
      })
    },
    // 取消关注
    async unfollow() {
      await unfollow({
        objType: 2,
        objId: this.getAlbumId,
        likeTimestamp: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }).then(() => {
        this.getCollectForm()
        this.isAlbumCollect(this.getAlbumId)
      })
    },
    // 提交评论
    async submit() {
      await saveComment({
        ...this.comment,
        replyUserId: this.replyUserId,
        root: this.rootId,
        parent: this.parent,
        content: this.content,
      })
      this.clear()
    },
    // 获取评论
    async getComment() {
      this.replyLoading = true
      const { data } = await select({
        objId: this.getAlbumId,
        objType: 2,
        id: 0,
      })
      this.total = data.count
      this.reply = data.comment
      this.replyLoading = false
      this.isEnd = data.isEnd
    },
    // 加载评论
    async load() {
      if (this.isEnd) return
      if (this.replyLoading) return
      clearTimeout(this.timeout)
      this.timeout = setTimeout(async () => {
        this.replyLoading = true
        const { data } = await select({
          objId: +this.$route.params.id,
          objType: 2,
          id: this.reply.slice(-1)[0].id,
        })
        this.reply.push(...data.comment)
        this.replyLoading = false
        this.isEnd = data.isEnd
      }, 1000)
    },
    // 更多评论
    async more({ pagination, objId, rootId }) {
      const { data } = await moreComment({
        ...pagination,
        objId: objId,
        objType: 2,
        rootId: rootId,
      })
      // 将子评论添加到对应根评论

      const find = this.reply.find(item => item.id === rootId)
      if (find) find.children = data.page
    },

    // 点赞 点赞表1为评论
    async like({ objId, objUserId }) {
      await likeApi({
        objId: objId,
        objType: 1,
        objUserId: objUserId,
        likeTimestamp: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        likeAction: 1,
      })
    },
    // 取消点赞
    async unlike({ objId, objUserId }) {
      await unlikeApi({
        objId: objId,
        objType: 1,
        objUserId: objUserId,
        likeTimestamp: this.$dayjs().format('YYYY-MM-DD HH:mm:ss'),
        likeAction: 2,
      })
    },
    handleSongContextMenu(e, item) {
      this.selectMusicId = e.currentTarget.dataset.music
      this.selectMusic = item
      this.$refs.contextMenu.handleContextMenu(e)
    },
    /*
      右键菜单选项
    */
    pickMenu(e) {
      if (!this.$store.getters.token) return this.$message.error('未登录')
      const { menu, sonItem } = e
      this.$useContextMenu({
        menu: menu,
        target: this.selectMusic,
        playList: sonItem?.id,
      })
    },
    // 检测页面触底
    handleScroll: throttle(function () {
      if (this.isEnd) return
      console.log(this.$refs.moreReply)
      if (this.$refs.moreReply) {
        const rect = this.$refs.moreReply.getBoundingClientRect()
        if (
          (rect.top >= 0 && rect.top <= window.innerHeight) ||
          (rect.bottom >= 0 && rect.bottom <= window.innerHeight)
        ) {
          this.load()
        }
      }
      // const offset = 21
      // const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >=
      //   document.documentElement.offsetHeight - offset
      // if (bottomOfWindow) {
      //   this.load()
      // }
    }, 500),
    handleClickMore({ event, musicId }) {
      this.selectMusicId = musicId
      this.$refs.contextMenu.handleContextMenu(event)
    },
  },
  created() {
    this.getAlbumById()
    this.getComment()
  },
  mounted() {
    // 将会话中的歌单数据赋值给菜单
    this.menu[0].menu.push(...this.getUserMusicForm)
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    getAlbumId() {
      return +this.$route.params.id
    },
    // 用户信息
    // isAlbumCollect判断专辑是否收藏 getUserMusicForm返回收藏夹歌单
    ...mapGetters('user', ['isAlbumCollect', 'getUserMusicForm']),
    ...mapState('comment', ['content', 'replyUserId', 'rootId', 'parent']),
  },
}
</script>

<template>
  <div class="album infinite-list-wrapper" v-title data-title="专辑详情">
    <Header :color="album.color">
      <p>{{ album.name }}</p>
    </Header>
    <div class="head">
      <div
        class="background-color"
        :style="{
          'background-color': album?.color,
        }"
      ></div>
      <div class="background-color shade"></div>
      <el-skeleton
        class="skeleton"
        style="width: 800px; display: flex; align-items: center"
        :loading="loading"
        animated
      >
        <template slot="template">
          <div style="display: flex; align-items: center">
            <el-skeleton-item
              variant="image"
              style="width: 225px; height: 225px; border-radius: 4px"
            />
            <div
              style="
                display: flex;
                flex-direction: column;
                margin-left: 20px;
                align-content: space-between;
              "
            >
              <el-skeleton-item
                variant="text"
                style="width: 120px; height: 21px; margin-bottom: 10px"
              />
              <el-skeleton-item
                variant="h1"
                style="width: 320px; height: 70px; margin-bottom: 10px"
              />
              <el-skeleton-item
                variant="text"
                style="width: 200px; height: 21px"
              />
            </div>
          </div>
        </template>
        <template>
          <el-image
            ref="image"
            style="min-width: 250px; min-height: 250px"
            class="img"
            fit="cover"
            :src="album.image"
            :preview-src-list="[album.image]"
            alt=""
          >
            <div
              slot="placeholder"
              style="
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <i
                class="el-icon-picture-outline"
                style="font-size: 80px; color: #b3b3b3"
              ></i>
            </div>
            <div
              slot="error"
              style="
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <i
                class="el-icon-picture-outline"
                style="font-size: 80px; color: #b3b3b3"
              ></i>
            </div>
          </el-image>
          <div class="album-detail">
            <span>专辑</span>
            <span style="font-size: 5rem; font-weight: bold">
              {{ album.name }}
            </span>
            <span style="margin-top: 10px">
              <i @click="$router.push(`/singer/${album.singerId}`)">
                {{ album.singerName }}
              </i>
              ·
              {{ album?.musicList?.length }}首歌曲
            </span>
          </div>
        </template>
      </el-skeleton>
    </div>
    <div class="gradual-block">
      <div
        class="background"
        :style="{
          'background-color': album?.color,
        }"
      ></div>
      <div class="album-plank">
        <ActionBar
          @submitPlay="submitPlay"
          @follow="attention"
          @unfollow="unfollow"
          :isShowFollow="true"
          :isFollow="this.isAlbumCollect(this.getAlbumId)"
        >
          <span @click="isReply = !isReply" style="color: #aaaaaa">
            <i
              class="iconfont icon-wodewenzhang icon"
              style="font-size: 40px"
            ></i>
          </span>
        </ActionBar>
      </div>
      <div v-show="isReply" class="musicList">
        <ContextMenu ref="contextMenu" :menu="menu" @select-menu="pickMenu">
          <MusicItem
            v-for="(item, index) in musicList"
            :key="item.id"
            :index="index + 1"
            :music="item"
            :backup="album?.image"
            :data-music="item.id"
            :class="{
              active: selectMusicId == item.id,
            }"
            @click-more="handleClickMore"
            @contextmenu.native="handleSongContextMenu($event, item)"
          />
          <template #menu-info>
            <div style="padding: 5px; display: flex; align-items: center">
              <div
                style="
                  min-width: 40px;
                  height: 40px;
                  border-radius: 3px;
                  overflow: hidden;
                "
              >
                <img
                  style="width: 100%; height: 100%"
                  :src="selectMusic?.image || album?.image"
                  alt=""
                />
              </div>
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  margin-left: 10px;
                  text-overflow: ellipsis;
                "
              >
                <span>
                  {{ selectMusic?.name }}
                </span>
                <span>
                  {{ selectMusic?.singerName }}
                </span>
              </div>
            </div>
          </template>
        </ContextMenu>
      </div>
      <div v-if="!isReply" class="replyView">
        <ul class="nav-bar">
          <li class="nav-title">
            <span class="title-text">评论</span>
            <span class="total-reply">
              {{ total }}
            </span>
          </li>
        </ul>
        <ReplyInput @sub="submit" @focus="clear" />
        <Reply
          v-for="item in reply"
          :key="item.id"
          :item="item"
          :obj-id="comment.objId"
          :obj-type="comment.objType"
          @submit="submit"
          @like="like"
          @unlike="unlike"
        />
        <p
          ref="moreReply"
          style="text-align: center; color: var(--text-color); height: 100px"
        >
          <i v-show="replyLoading" class="loader"></i>
          <i v-show="isEnd" class="end"></i>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.album {
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  .head {
    min-height: 400px;
    width: 100%;
    padding: 0 0 20px 20px;
    display: flex;
    align-items: flex-end;
    z-index: 0;
    position: relative;
    .shade {
      z-index: 1;
      background-image: linear-gradient(transparent 0, rgba(0, 0, 0, 0.3) 100%);
    }
    .background-color {
      z-index: -1;
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .skeleton {
      .img {
        z-index: 10;
        width: 14rem;
        height: 14rem;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
        &:hover {
          transform: scale(1.01);
          transition: transform 0.1s ease-out;
        }
      }
      ::v-deep .album-detail {
        display: flex;
        flex-direction: column;
        align-content: space-between;
        margin-left: 20px;
        span {
          width: 50rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--info-text);
        }
      }
    }
  }
  .gradual-block {
    z-index: -10;
    position: relative;
    width: 100%;
    min-height: calc(100vh - 400px);
    overflow: hidden;
    .background {
      z-index: 1;
      min-height: 20rem;
      position: absolute;
      width: 100%;
      background-image: linear-gradient(
        rgba(0, 0, 0, 0.4) 0,
        var(--main-background-color) 100%
      );
    }
    .album-plank {
      display: flex;
      align-items: center;
      width: 100%;
      z-index: 10;
      height: 5rem;
      position: absolute;
    }
    .musicList {
      width: 100%;
      min-height: 15rem;
      height: 100%;
      padding: 0 20px 20px 20px;
      position: relative;
      margin-top: 5rem;
      z-index: 10;
    }
    .replyView {
      width: 100%;
      height: 100%;
      padding: 0 40px 0 40px;
      position: relative;
      margin-top: 5rem;
      z-index: 10;
      .nav-bar {
        margin-bottom: 10px;
        .nav-title {
          color: var(--text-color);
          font-size: 20px;
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
            transition: all 0.3s ease-in-out;
            .btn {
              margin-left: auto;
            }
          }
          .hide {
            margin-top: -30px;
            height: 0;
            overflow: hidden;
            transition: all 0.2s ease-in-out;
          }
        }
      }
      .loader {
        width: fit-content;
        font-weight: bold;
        font-family: monospace;
        font-size: 14px;
        clip-path: inset(0 3ch 0 0);
        animation: l4 1s steps(4) infinite;
      }
      .loader:before {
        content: 'Loading...';
      }
      @keyframes l4 {
        to {
          clip-path: inset(0 -1ch 0 0);
        }
      }
      .end {
        width: fit-content;
        font-weight: bold;
        font-family: monospace;
        font-size: 14px;
        //clip-path: inset(0 3ch 0 0);
        //animation: l3 1s steps(4) infinite;
      }
      .end:before {
        content: '已经到底了...';
      }
      @keyframes l3 {
        to {
          clip-path: inset(0 -1ch 0 0);
        }
      }
    }
  }
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.2s ease;
}

.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
