<script>
import { getSearchHistory, setSearchHistory } from '@/utils/storage'
import { mapGetters } from 'vuex'
import MusicItem from '@/components/block/MusicItem.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import History from '@/views/layout/explore/search/history.vue'
import { useContextMenu } from '@/utils/useContextMenu'
import { search } from '@/api/user'

export default {
  name: 'searchObject',
  components: {
    MusicItem,
    ContextMenu,
    History
  },
  computed: {
    ...mapGetters('collect', ['getUserMusicForm'])
  },
  mounted () {
    this.menu[0].menu = this.getUserMusicForm
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
      clickInput: false,
      history: getSearchHistory(),
      keyword: '',
      timeout: true,
      result: {},
      isShowHistory: true,
      historyElement: null,
      // MusicItem组件省略号位置
      position: {},
      // 选中的歌曲
      pickMusicItem: {},
      firstSinger: null
    }
  },
  methods: {
    // 防抖
    debounce () {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.search()
      }, 1000)
    },
    // 搜索
    async search () {
      if (this.keyword.trim().length > 0) {
        await search(this.keyword).then(res => {
          this.result = res.data
          this.firstSinger = res.data.singerList?.slice(-1)[0]
        })
      }
    },
    // 选中的菜单选项
    pickMenu (e) {
      useContextMenu(e, this.pickMusicItem, this.getMusicFormId)
    },
    player () {
      // console.log('321')
    }
  },
  beforeRouteLeave: function (to, from, next) {
    this.history = getSearchHistory()
    // 查找本地记录是否存在，存在删除
    const index = this.history.findIndex(history => history.id === (Number(to.params.id)))
    const his = this.history[index]
    if (index !== -1) {
      this.history.splice(index, 1)
    }
    let newHistoryItem = null
    // 确保是从搜索页进入的歌手页或者专辑页
    if (from.path === '/explore/search' && to.name === 'Singer') {
      if (this.result.singerList) {
        newHistoryItem = this.result.singerList.find(singer => singer.id === Number(to.params.id))
      }
    }
    if (from.path === '/explore/search' && to.name === 'Album') {
      if (this.result.albumList) {
        newHistoryItem = this.result.albumList.find(album => album.id === Number(to.params.id))
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
  watch: {
    result: {
      handler (newVal, oldVal) {
        this.isShowHistory = false
      }
    }
  }
}
</script>

<template>
  <div class="search" v-title data-title="搜索">
    <form class="search-box">
      <div style="width: 100%; height: 100%; display: flex; padding: 10px 0 10px 0">
        <div class="input-inner" :class="{active: clickInput}">
          <input class="input"
                 placeholder="想听什么?"
                 v-model="keyword"
                 @input="debounce"
                 @focus="clickInput = !clickInput"
                 @blur="clickInput = !clickInput"
                 type="text" maxlength="100">
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
        <div class="singer-card" v-if="firstSinger != null" @click="$router.push(`/detail/singer/${firstSinger.id}`)">
          <div style="display: flex; flex-direction: column;">
            <el-image
              :src="firstSinger.avatar || firstSinger.image"
              style="border-radius: 50%; width: 100px; height: 100px;"
            />
            <div class="card-info">
              <span style="font-size: 35px;">{{firstSinger.name}}</span>
              <span class="info-but">
                <i>艺人</i>
                <button @click.stop="player" style="color: var(--info-text);" class="btn iconfont icon-icon_play" />
            </span>
            </div>
          </div>
        </div>
        <div class="music-card" style="margin-left: 20px;">
          <ContextMenu
            :menu="menu"
            :position="position"
            @select-menu="pickMenu"
          >
            <MusicItem
              v-for="(item,index) in result.musicList?.slice(0, 4)"
              @select-music="pickMusicItem = $event"
              @position="position = $event"
              :key="item.id"
              :music="item"
              :index="index+1"
            />
          </ContextMenu>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.search {
  width: 100%;
  height: calc(100vh - 40px);
  padding: 90px 20px 0 20px;
  .search-box {
    border-radius: 30px;
    height: 48px;
    width: 320px;
    background-color: #C0C4CC;
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
        transition: all .2s ease;
        background-color: #DCDFE6;
      }
    }
  }
  .result {
    margin-top: 20px;
    display: flex;
    width: 100%;
    .singer-card{
      background-color: var(--singer-card-bg);
      width: 400px;
      height: 224px;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid var(--block);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      cursor: pointer;
      transition: all .2s ease-in-out;
      position: relative;
      .card-info{
        margin-top: 15px;
        color: var(--text-color);
        .info-but{
          display: flex;
          .btn{
            position: absolute;
            bottom: 10px;
            right: 10px;
            background-color: #409EFF;
            transform: translateY(15px); /* 初始状态下，按钮向下移动 */
            transition: opacity 0.4s ease, transform 0.4s ease; /* 添加过渡效果 */
            opacity: 0;
            width: 50px; height: 50px; margin-left: auto; border-radius: 50%;
          }
        }
      }
      &:hover {
        background-color: var(--singer-card-bg-h);
      }
      &:hover .card-info .btn{
        opacity: 1;
        transform: translateY(0); /* 悬停时按钮回到原位 */
      }
    }
    .music-card{
      height: 224px;
      border-radius: 8px;
      border: 1px solid var(--block);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      cursor: pointer;
      transition: all .2s ease-in-out;
      overflow: hidden;
    }
  }
}
</style>
