<script>
import Reply from '@/components/bolck/reply.vue'
import ActionBar from '@/components/layout/ActionBar.vue'
import MusicItem from '@/components/bolck/MusicItem.vue'
import Header from '@/components/layout/Header.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import ReplyInput from '@/components/bolck/replyInput.vue'
import { useContextMenu } from '@/utils/useContextMenu'
import { getAlbumById } from '@/api/album'
import { getReplyAlbumById, insert } from '@/api/reply'
import { collect, unfollow } from '@/api/collect'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'albumDetail',
  components: {
    ContextMenu,
    ActionBar,
    MusicItem,
    Header,
    Reply,
    ReplyInput
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
      // 评论条数
      total: '',
      // 评论
      reply: ''
    }
  },
  methods: {
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList']),
    ...mapActions('collect', ['getCollectForm']),
    ...mapActions('reply', ['clear', 'setActiveReplyId']),
    // 获取专辑
    async getAlbumById () {
      await getAlbumById(this.getAlbumId).then(res => {
        if (res.data == null) return

        this.album = res.data
        this.musicList = res.data.musicList
      })
    },
    submitPlay () {
      this.setPlayList(this.musicList)
    },
    // 关注
    async attention () {
      if (this.isLogin) {
        await collect(null, this.getAlbumId, null).then(res => {
          this.getCollectForm()
          this.isAlbumCollect(this.getAlbumId)
        })
      }
    },
    // 取消关注
    async unfollow () {
      if (this.isLogin) {
        await unfollow(null, this.getAlbumId, null).then(res => {
          this.getCollectForm()
          this.isAlbumCollect(this.getAlbumId)
        })
      }
    },
    /*
      右键菜单选项
    */
    pickMenu (e) {
      useContextMenu(e, this.pickMusicItem, this.getMusicFormId)
    },
    // 获取评论
    async getReply () {
      await getReplyAlbumById(this.getAlbumId).then(res => {
        if (res.data == null) return

        this.total = res.data.total
        this.reply = res.data.page
        // console.log(res.data.page)
      })
    },
    // 提交评论
    async submit () {
      await insert(this.$store.state.reply.reply, null, this.getAlbumId, null, null)
        .then(res => {
          this.getReply()
          this.clear()
        })
    },
    // 点击固定输入框时，清除选中输入框
    toClear () {
      this.clear()
      this.setActiveReplyId(null)
    }
  },
  created () {
    this.getAlbumById()
    this.getReply()
  },
  mounted () {
    // 将会话中的歌单数据赋值给菜单
    this.menu[0].menu = this.getUserMusicForm
  },
  computed: {
    getAlbumId () {
      return +this.$route.params.id
    },
    // 用户信息
    // isAlbumCollect判断专辑是否收藏 getUserMusicForm返回收藏夹歌单
    ...mapGetters('collect', ['isAlbumCollect', 'getUserMusicForm']),
    isLogin () {
      return this.$store.getters.token
    }
  }
}
</script>

<template>
  <div class="album" v-title data-title="专辑详情">
    <Header :color="album.color">
      <p>{{ album.name }}</p>
    </Header>
    <div class="head">
      <div class="background-color" :style="{'background-color': album.color }"></div>
      <div class="background-color shade"></div>
      <el-image
        ref="image"
        style="min-width: 225px; min-height: 225px;"
        class="img"
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
        <span>{{ album.singerName }}</span>
      </div>
    </div>
    <div class="gradual-block">
      <div class="background" :style="{'background-color': album.color }"></div>
      <div class="album-plank">
        <ActionBar
          @submitPlay="submitPlay"
          @attention="attention"
          @unfollow="unfollow"
          :isExist="isAlbumCollect(this.getAlbumId)"
          :isReply.sync="isReply"
        >
        </ActionBar>
      </div>
      <transition name="component-fade" mode="out-in">
        <div v-if="isReply" class="musicList">
          <ContextMenu
            v-if="isReply"
            :menu="menu"
            :position="position"
            @select-menu="pickMenu"
          >
            <MusicItem
              v-for="(item, index) in musicList"
              @select-music="pickMusicItem = $event"
              @position="position = $event"
              :key="item.id"
              :index="index+1"
              :music="item"
            >
            </MusicItem>
          </ContextMenu>
        </div>
      </transition>
      <transition name="component-fade" mode="out-in">
        <div v-if="!isReply" class="replyView">
          <ul class="nav-bar">
            <li class="nav-title">
              <span class="title-text">评论</span>
              <span class="total-reply">{{ total }}</span>
            </li>
            <li></li>
          </ul>
          <ReplyInput @sub="submit" @focus="toClear"></ReplyInput>
          <Reply v-for="item in reply" :key="item.replyId" :item="item" @sub="submit"></Reply>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
$min-height: 400px;
$action-height: 5rem;

.album {
  position: relative;
  z-index: 1;

  .head {
    //height: 53vh;
    //min-height: 330px;
    //max-height: 400px;
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

    .img {
      z-index: 10;
      width: 14rem;
      height: 14rem;
      //min-width: 180px;
      //min-height: 180px;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 4px 60px rgba(0, 0, 0, .5);

      &:hover {
        transform: scale(1.01);
        transition: transform 0.1s ease-out;
      }
    }

    .album-detail {
      margin-left: 20px;
      display: flex;
      align-content: space-between;
      flex-direction: column;

      span {
        color: #ffffff;
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
      background-image: linear-gradient(rgba(0, 0, 0, .4) 0, #ffffff 100%);
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
      min-height: 15rem;
      //height: 30rem;
      padding: 0 40px 0 40px;
      position: relative;
      //top: -350px;
      margin-top: 5rem;
      z-index: 10;

      .nav-bar {
        margin-bottom: 10px;

        .nav-title {
          font-size: 20px;

          .title-text {
            color: #18191C;
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

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .2s ease;
}

.component-fade-enter, .component-fade-leave-to{
  opacity: 0;
}
</style>
