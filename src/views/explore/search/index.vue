<script>
import { getSearchHistory, setSearchHistory } from '@/utils/storage'
import { mapGetters } from 'vuex'
import MusicItem from '@/components/block/MusicItem.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import History from '@/views/explore/search/history.vue'
import { search } from '@/api/user'
import Block from '@/components/block/Block.vue'

export default {
  name: 'searchObject',
  beforeRouteLeave: function (to, from, next) {
    this.history = getSearchHistory()
    // 查找本地记录是否存在，存在删除
    const index = this.history.findIndex(
      history => history.id === Number(to.params.id)
    )
    const his = this.history[index]
    if (index !== -1) {
      this.history.splice(index, 1)
    }
    let newHistoryItem = null
    // 确保是从搜索页进入的歌手页或者专辑页
    if (from.path === '/explore/search' && to.name === 'Singer') {
      if (this.singerResult) {
        newHistoryItem = this.singerResult.find(
          singer => singer.id === Number(to.params.id)
        )
      }
    }
    if (from.path === '/explore/search' && to.name === 'Album') {
      if (this.albumResult) {
        newHistoryItem = this.albumResult.find(
          album => album.id === Number(to.params.id)
        )
      }
    }
    // 新记录存在就插入，不存在就插入之前的
    if (newHistoryItem) {
      this.history.unshift(newHistoryItem)
    } else if (his) {
      this.history.unshift(his)
    }
    setSearchHistory(this.history)
    next()
  },
  components: {
    Block,
    MusicItem,
    ContextMenu,
    History,
  },
  computed: {
    ...mapGetters('user', ['getUserMusicForm']),
  },
  mounted() {
    this.menu[0].menu = this.getUserMusicForm
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
          id: 3,
          label: '删除',
          icon: 'el-icon-delete',
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
      // 类型
      category: [
        {
          key: 'all',
          value: '全部',
        },
        {
          key: 'singer',
          value: '艺人',
        },
        {
          key: 'music',
          value: '歌曲',
        },
        {
          key: 'album',
          value: '专辑',
        },
        {
          key: 'playlist',
          value: '歌单',
        },
      ],
      // 搜索类型
      searchCategory: 'all',
      clickInput: false,
      history: getSearchHistory(),
      // 搜索关键字
      keyword: '',
      timeout: true,
      // 结果
      result: {},
      // 是否显示搜索历史
      isShowHistory: true,
      historyElement: null,
      // MusicItem组件省略号位置
      position: {},
      // 选中的歌曲
      pickMusicItem: {},
      firstSinger: null,
      allResult: {},
      singerResult: [],
      albumResult: [],
      playlistResult: [],
      musicResult: [],
      selectMusicId: null,
    }
  },
  methods: {
    // 防抖
    debounce() {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.search()
      }, 1000)
    },
    // 搜索
    async search() {
      if (this.keyword.trim().length > 0) {
        await search(this.keyword).then(res => {
          this.allResult = res.data
          this.firstSinger = res.data.singerList?.slice(-1)[0]
          this.singerResult = res.data.singerList
          this.musicResult = res.data.musicList
          this.albumResult = res.data.albumList
          this.isShowHistory = false
        })
      }
    },
    // 选中的菜单选项
    pickMenu(e) {
      if (!this.$store.getters.token) return this.$message.error('未登录')
      const { menu, sonItem } = e
      this.$useContextMenu({
        menu: menu,
        target: this.selectMusic,
        playList: sonItem?.id,
      })
    },
    handleSongContextMenu(e, item) {
      this.selectMusicId = e.currentTarget.dataset.music
      this.selectMusic = item
      this.$refs.contextMenu.handleContextMenu(e)
    },
    handleClickMore({ event, musicId }) {
      this.selectMusicId = musicId
      this.$refs.contextMenu.handleContextMenu(event)
    },
    player() {
      // console.log('321')
    },
  },
}
</script>

<template>
  <div class="search" v-title data-title="搜索">
    <form class="search-box">
      <div
        style="width: 100%; height: 100%; display: flex; padding: 10px 0 10px 0"
      >
        <div class="input-inner" :class="{ active: clickInput }">
          <input
            class="input"
            placeholder="想听什么?"
            v-model="keyword"
            @input="debounce"
            @focus="clickInput = !clickInput"
            @blur="clickInput = !clickInput"
            type="text"
            maxlength="100"
          />
        </div>
        <div class="search-icon">
          <i class="el-icon-search"></i>
        </div>
      </div>
    </form>
    <transition>
      <div v-if="isShowHistory" class="history">
        <History></History>
      </div>
    </transition>
    <transition name="el-fade-in">
      <div class="result" v-if="firstSinger">
        <el-row style="margin: 2rem 0">
          <el-button
            v-for="item in category"
            :key="item.key"
            @click="searchCategory = item.key"
            :class="{ active: item.key === searchCategory }"
            size="medium"
            round
          >
            {{ item.value }}
          </el-button>
        </el-row>
        <div class="content">
          <div class="all" v-if="searchCategory === 'all'">
            <div
              class="singer-card"
              @click="$router.push(`/singer/${firstSinger?.id}`)"
            >
              <div style="display: flex; flex-direction: column">
                <el-image
                  :src="firstSinger?.avatar || firstSinger?.image"
                  style="border-radius: 50%; width: 100px; height: 100px"
                />
                <div class="card-info">
                  <span style="font-size: 35px">{{ firstSinger?.name }}</span>
                  <span class="info-but">
                    <i>艺人</i>
                    <button
                      @click.stop="player"
                      style="color: var(--info-text)"
                      class="btn iconfont icon-icon_play"
                    />
                  </span>
                </div>
              </div>
            </div>
            <div class="music-card" style="margin-left: 20px">
              <ContextMenu
                ref="contextMenu"
                :menu="menu"
                @select-menu="pickMenu"
              >
                <MusicItem
                  v-for="(item, index) in musicResult?.slice(0, 4)"
                  :key="item.id"
                  :index="index + 1"
                  :music="item"
                  :data-music="item.id"
                  :class="{ active: selectMusicId == item.id }"
                  @click-more="handleClickMore"
                  @contextmenu.native="handleSongContextMenu($event, item)"
                />
              </ContextMenu>
            </div>
          </div>
          <div
            class="singer"
            v-if="searchCategory === 'singer'"
            style="display: flex; flex-wrap: wrap"
          >
            <Block v-for="item in singerResult" :key="item.id">
              <template #img>
                <img
                  :src="item.avatar || item.image"
                  v-if="item.language"
                  style="
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    border-radius: 50%;
                    object-fit: cover;
                  "
                  alt=""
                  @click="$router.push(`/singer/${item.id}`)"
                />
              </template>
              <template #nameOne>
                <i
                  v-if="item.language"
                  @click="$router.push(`/singer/${item.id}`)"
                >
                  {{ item.name }}
                </i>
                <i v-else @click="$router.push(`/album/${item.id}`)">
                  {{ item.name }}
                </i>
              </template>
              <template #nameTwo>
                <i
                  v-if="item.language"
                  @click="$router.push(`/singer/${item.id}`)"
                >
                  艺人
                </i>
                <i v-else>{{ item.singerName }}</i>
              </template>
            </Block>
          </div>
          <div class="music" v-if="searchCategory === 'music'">
            <ContextMenu
              :menu="menu"
              :position="position"
              @select-menu="pickMenu"
            >
              <MusicItem
                v-for="(item, index) in musicResult"
                @select-music="pickMusicItem = $event"
                @position="position = $event"
                :key="item.id"
                :index="index + 1"
                :music="item"
              />
            </ContextMenu>
          </div>
          <div class="music" v-if="searchCategory === 'album'"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.search {
  width: 100%;
  min-height: calc(100vh - 60px);
  padding: 90px 20px 0 20px;
  .search-box {
    border-radius: 30px;
    height: 48px;
    width: 320px;
    background-color: #c0c4cc;
    &:hover {
      border: 2px solid #909399;
    }
    .input-inner {
      width: 100%;
      height: 100%;
      border-radius: 3px;
      margin-left: 15px;
      .input {
        color: #303133;
        width: 100%;
        height: 100%;
        font-size: 16px;
        font-weight: normal;
        display: flex;
        align-items: center;
        background-color: transparent;
        border: none;
        overflow: hidden;
        outline: none;
      }
    }
    .search-icon {
      padding: 5px;
      border-radius: 3px;
      margin: 0 10px;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        transition: all 0.2s ease;
        background-color: #dcdfe6;
      }
    }
  }
  .result {
    margin-top: 20px;
    width: 100%;
    .el-row {
      .active {
        color: #409eff;
      }
      .el-button {
        border: none;
        background-color: var(--aside-background-color);
      }
    }
    .content {
      .all {
        display: flex;
        .singer-card {
          background-color: var(--singer-card-bg);
          width: 400px;
          height: 224px;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid var(--block);
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          position: relative;
          .card-info {
            margin-top: 15px;
            color: var(--text-color);
            .info-but {
              display: flex;
              .btn {
                position: absolute;
                bottom: 10px;
                right: 10px;
                background-color: #409eff;
                transform: translateY(15px); /* 初始状态下，按钮向下移动 */
                transition: opacity 0.4s ease, transform 0.4s ease; /* 添加过渡效果 */
                opacity: 0;
                width: 50px;
                height: 50px;
                margin-left: auto;
                border-radius: 50%;
              }
            }
          }
          &:hover {
            background-color: var(--singer-card-bg-h);
          }
          &:hover .card-info .btn {
            opacity: 1;
            transform: translateY(0); /* 悬停时按钮回到原位 */
          }
        }
        .music-card {
          height: 224px;
          border-radius: 8px;
          border: 1px solid var(--block);
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
