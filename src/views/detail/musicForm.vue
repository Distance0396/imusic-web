<script>
import MusicItem from '@/components/bolck/MusicItem.vue'
import ActionBar from '@/components/layout/ActionBar.vue'
import Header from '@/components/layout/Header.vue'
// import ColorThief from 'colorthief'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import { useContextMenu } from '@/utils/useContextMenu'
import { mapState, mapActions, mapMutations } from 'vuex'
// import { getSimpleUserById } from '@/api/user'
export default {
  name: 'musicForm',
  mounted () {
    this.menu[0].menu = this.musicFormList
  },
  created () {
    this.getMusicForm(this.getMusicFormId)
  },
  components: {
    ActionBar,
    MusicItem,
    ContextMenu,
    Header
  },
  data () {
    return {
      backgroundColor: [],
      image: '',
      menu: [
        {
          id: 1,
          label: '加入歌单',
          icon: 'el-icon-folder-checked',
          menu: []
        },
        { id: 2, label: '加入队列', icon: 'el-icon-menu' },
        { id: 3, label: '删除', icon: 'el-icon-delete' },
        { id: 4, label: '跳转至歌手', icon: 'el-icon-s-promotion' },
        { id: 5, label: '分享给好友', icon: 'el-icon-info' }
      ],
      pickMusicItem: {}
    }
  },
  methods: {
    ...mapActions('music', ['getMusicForm']),
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList']),
    pickMenu (e) {
      useContextMenu(e, this.pickMusicItem, this.getMusicFormId)
    },
    submitPlay () {
      this.setPlayList(this.musicList)
    }
  },
  computed: {
    ...mapState('music', ['musicFormList', 'musicForm', 'musicList']),
    // 获取专辑id
    getMusicFormId () {
      return this.$route.params.id
    }
  }
}
</script>

<template>
  <div class="music-form">
    <Header :color="musicForm.color">
      <p>{{musicForm.name}}</p>
    </Header>
    <div class="head">
      <div class="background-color" :style="{'background-color': musicForm.color }"></div>
      <div class="background-color shade"></div>
      <el-image ref="image" style="min-width: 225px; min-height: 225px;"  class="img" :src="this.musicForm.image + '?time=' + new Date().valueOf()" alt="">
        <div slot="placeholder" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
          <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
        </div>
        <div slot="error" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
          <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
        </div>
      </el-image>
      <div class="album-detail">
        <span>专辑</span>
        <span style="font-size: 5rem; font-weight: bold">{{musicForm.name}}</span>
        <span>{{musicForm.architect}}·{{musicList.length}}首歌曲</span>
      </div>
    </div>
    <div class="gradual-block" :style="{'background-color': musicForm.color }"></div>
    <div class="album-plank">
      <ActionBar
        @submitPlay="submitPlay"
      ></ActionBar>
    </div>
    <div class="musicList">
      <ContextMenu
        :menu="menu"
        @select="pickMenu"
      >
        <MusicItem
          v-for="(item, index) in musicList"
          :key="item.id"
          :index="index+1"
          @select="pickMusicItem = $event"
          :music="item"
        />
      </ContextMenu>
    </div>
  </div>
</template>

<style scoped lang="less">
.music-form{
  position: relative;
  z-index: 1;
  overflow: hidden;
  height: 100%;
  .head{
    height: 53vh;
    min-height: 330px;
    max-height: 400px;
    width: 100%;
    padding: 0 0 20px 20px;
    display: flex;
    align-items: flex-end;
    z-index: 0;
    position: relative;
    .shade{
      z-index: 1;
      background-image: linear-gradient(transparent 0, rgba(0, 0, 0, .3) 100%);
    }
    .background-color{
      z-index: -1;
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .img{
      z-index: 10;
      width: 14rem;
      height: 14rem;
      //min-width: 180px;
      //min-height: 180px;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 4px 60px rgba(0, 0, 0, .5);
      &:hover{
        transform: scale(1.01);
        transition: transform 0.1s ease-out;
      }
    }
    .album-detail{
      margin-left: 20px;
      display: flex;
      align-content: space-between;
      flex-direction: column;
      span{
        color: #ffffff;
      }
    }
  }
  .gradual-block{
    //position: relative;
    z-index: 1;
    float: left;
    width: 100%;
    height: 530px;
    background-image: linear-gradient(rgba(0, 0, 0, .4) 0, #ffffff 100%);
  }
  .album-plank{
    display: flex;
    align-items: center;
    width: 100%;
    z-index: 10;
    height: 5rem;
    position: absolute;
  }
  .musicList{
    width: 100%;
    height: 30rem;
    padding: 0 20px 0 20px;
    position: absolute;
    margin-top: 5rem;
    //bottom: 5rem;
    z-index: 10;
  }
}
</style>
