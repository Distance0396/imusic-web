<script>
import { getSearchHistory, setSearchHistory } from '@/utils/storage'
import { search } from '@/api/common'
import { mapState } from 'vuex'
import Block from '@/components/bolck/Block.vue'
import MusicItem from '@/components/bolck/MusicItem.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import History from '@/components/history.vue'

export default {
  name: 'searchObject',
  components: {
    Block,
    MusicItem,
    ContextMenu,
    History
  },
  computed: {
    ...mapState('music', ['musicFormList'])
  },
  mounted () {
    this.menu[0].menu = this.musicFormList
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
      historyElement: null
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
        })
      }
    },
    // 选中的菜单选项
    select (e) {
      console.log(e)
    },
    // 选中的歌曲
    pickMusicItem (e) {
      console.log(e)
    }
  },
  beforeRouteLeave: function (to, from, next) {
    // 查找本地记录是否存在，存在删除
    const index = this.history.findIndex(history => history.id === (Number(to.params.id)))
    const his = this.history[index]
    if (index !== -1) {
      this.history.splice(index, 1)
    }
    if (from.path === '/explore/explore' && to.name === 'Singer') {
      if (this.result.singerList) this.history.unshift(this.result.singerList.find(singer => singer.id === Number(to.params.id)))
      else this.history.unshift(his)
    }
    if (from.path === '/explore/explore' && to.name === 'Album') {
      if (this.result.albumList) this.history.unshift(this.result.albumList.find(singer => singer.id === Number(to.params.id)))
      else this.history.unshift(his)
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
  <div class="search">
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
    <el-collapse-transition>
      <div v-if="isShowHistory" class="history">
        <History></History>
      </div>
    </el-collapse-transition>
    <transition name="el-fade-in">
      <div class="result">
        <div class="singer">
          <Block v-for="item in result.singerList" :key="item.id">
            <template #img>
              <img :src="item.avatar || item.image"
                   style="width: 100%;
                 height: 100%;
                 cursor: pointer;
                 border-radius: 50%;
                 object-fit: cover;"
                   alt=""
                   @click="$router.push(`/detail/singer/${item.id}`)"
              >
            </template>
            <template #nameOne>
              <i @click="$router.push(`/detail/singer/${item.id}`)">{{ item.name }}</i>
            </template>
            <template #nameTwo>
              艺人
            </template>
          </Block>
        </div>
        <div class="music">
          <ContextMenu
            :menu="menu"
            @select="select">
            <MusicItem
              v-for="(item,index) in result.musicList"
              @select="pickMusicItem"
              :key="item.id" :music="item" :index="index+1"
            />
          </ContextMenu>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="less">
.search {
  width: 100%;
  height: 100%;
  //margin-top: 60px;
  padding: 60px 20px 0 20px;

  .search-box {
    left: 0%;
    top: 10%;
    display: flex;
    align-items: center;
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
      //padding: 5px;
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
  }
}
</style>
