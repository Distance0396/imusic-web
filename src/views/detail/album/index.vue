<script>
import Reply from '@/components/block/reply.vue'
import ActionBar from '@/components/layout/ActionBar.vue'
import MusicItem from '@/components/block/MusicItem.vue'
import Header from '@/components/layout/Header.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import ReplyInput from '@/components/block/replyInput.vue'
import { useContextMenu } from '@/utils/useContextMenu'
import { getAlbumById } from '@/api/album'
import { collect, unfollow } from '@/api/collect'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { moreComment, saveComment, select } from '@/api/comment'
import { likeApi, unlikeApi } from '@/api/support'

export default {
  name: 'albumDetail',
  components: {
    ContextMenu, ActionBar, MusicItem, Header, Reply, ReplyInput
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
        {
          id: 2,
          label: '加入队列',
          icon: 'el-icon-menu'
        },
        {
          id: 3,
          label: '删除',
          icon: 'el-icon-delete'
        },
        {
          id: 4,
          label: '跳转至歌手',
          icon: 'el-icon-s-promotion'
        },
        {
          id: 5,
          label: '分享给好友',
          icon: 'el-icon-info'
        }
      ],
      album: {
        image: '',
        singerName: ''
      },
      musicList: [],
      // MusicItem组件点击省略号时间
      position: {},
      pickMusicItem: {},
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
        parent: 0
        // content: ''
      },
      loading: true,
      replyLoading: false,
      timeout: null,
      is_end: false
    }
  },
  methods: {
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList']),
    ...mapMutations('comment', ['setRootId']),
    ...mapActions('collect', ['getCollectForm']),
    ...mapActions('comment', ['updateCommentProperty', 'clear']),
    // 获取专辑
    async getAlbumById () {
      const { data } = await getAlbumById(this.getAlbumId)
      if (data == null) return

      this.album = data
      this.musicList = data.musicList
      this.loading = false
    },
    submitPlay () {
      this.setPlayList(this.musicList)
    },
    // 关注
    async attention () {
      await collect(2, this.getAlbumId).then(res => {
        this.getCollectForm()
        this.isAlbumCollect(this.getAlbumId)
      })
    },
    // 取消关注
    async unfollow () {
      await unfollow(2, this.getAlbumId).then(res => {
        this.getCollectForm()
        this.isAlbumCollect(this.getAlbumId)
      })
    },
    /*
      右键菜单选项
    */
    pickMenu (e) {
      useContextMenu(e, this.pickMusicItem, this.getMusicFormId)
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
      this.clear()
    },
    async getComment () {
      const { data } = await select({
        objId: +this.$route.params.id,
        objType: 2,
        id: 0
      })
      this.reply = data.comment
      this.total = data.count
    },
    // 更多评论
    async more ({ pagination, objId, rootId }) {
      const { data } = await moreComment({ ...pagination, objId: objId, objType: 2, rootId: rootId })
      // 将子评论添加到对应根评论
      const find = this.reply.find(item => item.id === rootId)
      if (find) find.children = data.page
    },
    // 点赞 点赞表1为评论
    async like ({ objId, objUserId }) {
      await likeApi({ objId, objType: 1, objUserId, likeTimestamp: new Date(), likeAction: 1 })
    },
    // 取消点赞
    async unlike ({ objId, objUserId }) {
      await unlikeApi({ objId, objType: 1, objUserId, likeTimestamp: new Date(), likeAction: 2 })
    },
    // 加载评论
    async load () {
      if (this.replyLoading) return
      if (this.is_end) return
      this.replyLoading = true
      clearTimeout(this.timeout)
      this.timeout = setTimeout(async () => {
        const { data } = await select({
          objId: +this.$route.params.id,
          objType: 2,
          id: this.reply.slice(-1)[0].id
        })
        this.reply.push(...data.comment)
        this.replyLoading = false
        this.is_end = data.is_end
      }, 1000)
    },
    // 检测页面触底
    handleScroll () {
      const offset = 21
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >=
        document.documentElement.offsetHeight - offset
      if (bottomOfWindow) {
        this.load()
      }
    }
  },
  created () {
    this.getAlbumById()
    this.getComment()
  },
  mounted () {
    // 将会话中的歌单数据赋值给菜单
    this.menu[0].menu = this.getUserMusicForm
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    // isLogin () { return this.$store.getters.token },
    getAlbumId () { return +this.$route.params.id },
    // 用户信息
    // isAlbumCollect判断专辑是否收藏 getUserMusicForm返回收藏夹歌单
    ...mapGetters('collect', ['isAlbumCollect', 'getUserMusicForm']),
    ...mapState('comment', ['content', 'replyUserId', 'rootId', 'parent'])
    // disabled () {
    //   return this.replyLoading
    // }
  }
}
</script>

<template>
  <div class="album infinite-list-wrapper" v-title data-title="专辑详情">
    <Header :color="album.color">
      <p>{{ album.name }}</p>
    </Header>
    <div class="head">
      <div class="background-color" :style="{'background-color': album.color }"></div>
      <div class="background-color shade"></div>
      <el-skeleton class="skeleton" style="width: 800px; display: flex; align-items: center;" :loading="loading" animated>
        <template slot="template">
          <div style="display: flex; align-items: center;">
            <el-skeleton-item
              variant="image"
              style="width: 225px; height: 225px; border-radius: 4px;"
            />
            <div style="display: flex; flex-direction: column; margin-left: 20px; align-content: space-between;">
              <el-skeleton-item variant="text" style="width: 120px; height: 21px; margin-bottom: 10px;" />
              <el-skeleton-item variant="h1" style="width: 320px; height: 70px; margin-bottom: 10px;" />
              <el-skeleton-item variant="text" style="width: 200px; height: 21px;" />
            </div>
          </div>
        </template>
        <template>
          <el-image
            ref="image"
            style="min-width: 250px; min-height: 250px;"
            class="img"
            fit="cover"
            :src="album.image"
            :preview-src-list="[album.image]"
            alt="">
            <div slot="placeholder"
                 style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
              <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
            </div>
            <div slot="error"
                 style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
              <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
            </div>
          </el-image>
          <div class="album-detail">
            <span>专辑</span>
            <span style="font-size: 5rem; font-weight: bold">{{ album.name }}</span>
<!--            <span>{{ album.singerName }}</span>-->
<!--            <span style="font-size: 10px;">{{album.description}}</span>-->
            <span style="margin-top: 10px;">
              <i @click="$router.push(`/detail/singer/${album.singerId}`)">{{ album.singerName }}</i> ·
              {{ album?.musicList?.length }}首歌曲
            </span>
          </div>
        </template>
      </el-skeleton>
    </div>
    <div class="gradual-block">
      <div class="background" :style="{'background-color': album.color }"></div>
      <div class="album-plank">
        <ActionBar
          @submitPlay="submitPlay"
          @attention="attention"
          @unfollow="unfollow"
          :isExist="this.isAlbumCollect(this.getAlbumId)"
        >
          <span @click="isReply = !isReply" style="fill: #aaaaaa; min-width: 40px; min-height: 40px;">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M853.333333 768c35.413333 0 64-20.650667 64-55.978667V170.581333A63.978667 63.978667 0 0 0 853.333333 106.666667H170.666667C135.253333 106.666667 106.666667 135.253333 106.666667 170.581333v541.44C106.666667 747.285333 135.338667 768 170.666667 768h201.173333l110.016 117.44a42.752 42.752 0 0 0 60.586667 0.042667L651.904 768H853.333333z m-219.029333-42.666667h-6.250667l-115.797333 129.962667c-0.106667 0.106667-116.010667-129.962667-116.010667-129.962667H170.666667c-11.776 0-21.333333-1.621333-21.333334-13.312V170.581333A21.205333 21.205333 0 0 1 170.666667 149.333333h682.666666c11.776 0 21.333333 9.536 21.333334 21.248v541.44c0 11.754667-9.472 13.312-21.333334 13.312H634.304zM341.333333 490.666667a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z"></path></svg>
          </span>
        </ActionBar>
      </div>
      <div v-if="isReply" class="musicList">
        <ContextMenu v-if="isReply"
          :menu="menu"
          :position="position"
          @select-menu="pickMenu"
        >
          <MusicItem v-for="(item, index) in musicList"
            :key="item.id"
            :index="index+1"
            :music="item"
            @select-music="pickMusicItem = $event"
            @position="position = $event"
          />
        </ContextMenu>
      </div>
      <div v-if="!isReply" class="replyView">
        <ul class="nav-bar">
          <li class="nav-title">
            <span class="title-text">评论</span>
            <span class="total-reply">{{ total }}</span>
          </li>
          <li></li>
        </ul>
        <ReplyInput @sub="submit" @focus="clear" />
        <Reply v-for="item in reply" :key=" 'reply' + item.id" :item="item"
          @more="more"
          @submit="submit"
          @like="like"
          @unlike="unlike"
        />
        <p style="text-align: center;">
          <i v-show="replyLoading" class="loader"></i>
          <i v-show="is_end" class="end"></i>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$min-height: 400px;
$action-height: 5rem;

.album {
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  //overflow-y: auto;
  .head {
    min-height: $min-height;
    width: 100%;
    padding: 0 0 20px 20px;
    display: flex;
    align-items: flex-end;
    z-index: 0;
    position: relative;

    .shade {
      z-index: 1;
      background-image: linear-gradient(transparent 0, rgba(0, 0, 0, .3) 100%);
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
    .skeleton{
      .img {
        z-index: 10;
        width: 14rem;
        height: 14rem;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 4px 60px rgba(0, 0, 0, .5);

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
          color: var(--info-text)
          //color: #ffffff;
        }
      }
    }

  }

  .gradual-block {
    z-index: -10;
    position: relative;
    width: 100%;
    min-height: calc(100vh - $min-height - 40px);
    overflow: hidden;

    .background {
      z-index: 1;
      min-height: 20rem;
      position: absolute;
      width: 100%;
      background-image: linear-gradient(rgba(0, 0, 0, .4) 0, var(--main-background-color) 100%);
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
      .loader {
        width: fit-content;
        font-weight: bold;
        font-family: monospace;
        font-size: 14px;
        clip-path: inset(0 3ch 0 0);
        animation: l4 1s steps(4) infinite;
      }
      .loader:before {
        content:"Loading..."
      }
      @keyframes l4 {
        to { clip-path: inset(0 -1ch 0 0) }
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
        content:"已经到底了..."
      }
      @keyframes l3 {
        to { clip-path: inset(0 -1ch 0 0) }
      }
    }
  }
}

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .2s ease;
}

.component-fade-enter, .component-fade-leave-to{
  opacity: 0;
}
</style>
