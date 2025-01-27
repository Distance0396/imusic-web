<script>
import MusicItem from '@/components/block/MusicItem.vue'
import ActionBar from '@/components/layout/ActionBar.vue'
import Header from '@/components/layout/Header.vue'
import ContextMenu from '@/components/contextMenu/contextMenu.vue'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { deleteById, updateMusicForm } from '@/api/muiscForm'

export default {
  name: 'PlayList',
  mounted () {
    this.getMusicForm(this.getMusicFormId)
    this.menu[0].menu.push(...this.getUserMusicForm)
  },
  components: {
    ActionBar,
    MusicItem,
    ContextMenu,
    Header
  },
  data () {
    return {
      // 右键菜单
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
      // 控制修改歌单弹窗显示
      dialogVisible: false,
      // MusicItem组件省略号位置
      clickMore: {},
      // 上传加载
      loading: false,
      // 选中音乐id
      selectMusicId: null,
      // 选中音乐
      selectMusic: null
    }
  },
  methods: {
    /*
      歌单
     */
    ...mapActions('musicForm', ['getMusicForm', 'updateMusicFormProperty']),
    /*
      收藏夹
     */
    ...mapActions('user', ['getCollectForm']),
    ...mapMutations('player', ['setCurrentCol']),
    /*
      播放队列
     */
    ...mapMutations('playlist', ['pushPlayList', 'setPlayList']),
    /*
      点击播放
     */
    submitPlay () {
      this.setPlayList(this.musicList)
    },
    /*
      修改歌单 图片上传前
     */
    beforeUpload (file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传图片只能是 png/jpg 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      if (isImage && isLt2M) {
        this.loading = true
      }
      return isImage && isLt2M
    },
    /*
      提交歌单修改
     */
    async subUpdate () {
      await updateMusicForm(this.musicForm).then(res => {
        this.dialogVisible = false
      })
    },
    /*
      图片上传成功回调
     */
    uploadOk (res) {
      this.loading = false
      this.image = res.data
    },
    /*
      上传失败
     */
    uploadError () {
      this.$message({
        message: '上传失败',
        type: 'warning'
      })
      this.loading = false
    },
    /*
      删除歌单
     */
    async delPlaylist () {
      await deleteById(this.musicForm.id)
      await this.$store.dispatch('user/getCollectForm')
    },
    handleSongContextMenu (e, item) {
      this.selectMusicId = e.currentTarget.dataset.music
      this.selectMusic = item
      this.$refs.contextMenu.handleContextMenu(e)
    },
    /*
      右键菜单选项
     */
    pickMenu (e) {
      if (!this.isLogin) return this.$message.error('未登录')
      const { menu } = e
      this.$useContextMenu(menu, this.selectMusic, 1)
      this.$refs.contextMenu.showMenu = false
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapGetters('user', ['isMusicFormCollect', 'getUserMusicForm']),
    ...mapState('musicForm', ['musicForm', 'musicList']),
    ...mapGetters('musicForm', ['getMusicFormProperty']),
    isLogin () { return this.$store.getters.token },
    /*
      获取路由传参中的专辑id
     */
    getMusicFormId () { return +this.$route.params.id },
    name: {
      get () {
        return this.getMusicFormProperty('name')
      },
      set (value) {
        this.updateMusicFormProperty({ property: 'name', value })
      }
    },
    description: {
      get () {
        return this.getMusicFormProperty('description')
      },
      set (value) {
        this.updateMusicFormProperty({ property: 'description', value })
      }
    },
    image: {
      get () {
        return this.getMusicFormProperty('image')
      },
      set (value) {
        this.updateMusicFormProperty({ property: 'image', value })
      }
    }
  }
}
</script>

<template>
  <div class="music-form" v-title data-title="歌单详情">
    <Header :color="musicForm?.color">
      <p>{{musicForm.name}}</p>
    </Header>
    <div class="head">
      <div class="background-color" :style="{'background-color': musicForm?.color }"></div>
      <div class="background-color shade"></div>
      <el-image
        ref="image"
        style="min-width: 225px; min-height: 225px;"
        class="img"
        :src="musicForm?.image"
        :preview-src-list="[musicForm?.image]"
        alt="">
        <div slot="placeholder" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
          <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
        </div>
        <div slot="error" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
          <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
        </div>
      </el-image>
      <div class="album-detail">
        <span>歌单</span>
        <span style="font-size: 5rem; font-weight: bold">{{musicForm?.name}}</span>
        <span style="font-size: 10px;">{{musicForm?.description}}</span>
        <span style="margin-top: 10px;">{{musicForm?.architect}} · {{musicList?.length}}首歌曲</span>
      </div>
    </div>
    <div class="context">
      <div class="gradual-block" :style="{'background-color': musicForm?.color }"></div>
      <div class="album-plank">
        <ActionBar
          @submitPlay="submitPlay"
          :isShowFollow="false"
          :isFollow="isMusicFormCollect(this.getMusicFormId)"
        >
          <div v-if="musicForm.architectId === this.userInfo.id" >
            <span>
              <i @click="dialogVisible = true" style="font-size: 30px;" class="iconfont icon-xiugai icon" />
            </span>
            <el-popconfirm
              title="确定此歌单删除吗？"
              @confirm="delPlaylist"
            >
              <i slot="reference" style="font-size: 30px;" class="iconfont icon-jianpanshouqi icon" />
            </el-popconfirm>
          </div>
        </ActionBar>
      </div>
      <div class="musicList">
        <ContextMenu
          :menu="menu"
          :more="clickMore"
          @select-menu="pickMenu"
          ref="contextMenu"
        >
          <MusicItem
            v-for="(item, index) in musicList"
            :key="item.id"
            :index="index+1"
            :music="item"
            :backup="musicForm?.image"
            :class="{ active : selectMusicId == item.id }"
            @click-more="clickMore = $event"
            @contextmenu.native="handleSongContextMenu($event, item)"
          />
        </ContextMenu>
      </div>
    </div>
    <el-dialog
      title="编辑详情"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="500px"
    >
      <div style="display: flex; justify-content: space-between;">
        <!-- 图片上传组件 -->
        <el-upload
          v-loading="loading"
          class="upload"
          action="/v2/upload"
          :show-file-list="false"
          :limit="1"
          :auto-upload="true"
          :before-upload="beforeUpload"
          :on-success="uploadOk"
          :on-error="uploadError"
        >
          <!-- 如果没有图片，显示加号图标 -->
          <div v-if="!musicForm.image" class="error-img-box" >
            <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
            <span class="el-upload-list__item-actions change-icon">
              <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M994.72 973.44A39.84 39.84 0 0 1 960.8 992H80a39.84 39.84 0 0 1-33.92-18.4 34.4 34.4 0 0 1 0-36.64A40.16 40.16 0 0 1 80 918.24h880a39.84 39.84 0 0 1 34.08 18.4 34.08 34.08 0 0 1 0.64 36.8zM545.44 688a272 272 0 0 1-148 68.64l-96 7.84c-46.24 3.84-71.68 5.92-76.48 5.92a36.96 36.96 0 0 1-26.24-10.72c-12.64-12.48-12.64-12.48-5.12-102.56l8-96a272 272 0 0 1 68.64-148l352-351.2a113.28 113.28 0 0 1 155.84 0l118.88 118.88a109.92 109.92 0 0 1 0 155.36z m299.52-455.2l-118.88-118.88a37.12 37.12 0 0 0-51.84 0l-352 352a195.52 195.52 0 0 0-48 102.24l-8 96-2.56 30.88 30.88-2.56 96-8a196.64 196.64 0 0 0 102.24-48l352-351.04a37.12 37.12 0 0 0 0-51.84z"></path></svg>
            </span>
          </div>
          <!-- 如果有图片，显示图片及操作图标 -->
          <div v-else style="position: relative; width: 200px; height: 200px">
            <img
              class="el-upload-list__item-thumbnail img"
              :src="musicForm.image"
              alt=""
            >
            <span class="el-upload-list__item-actions change-icon">
              <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M994.72 973.44A39.84 39.84 0 0 1 960.8 992H80a39.84 39.84 0 0 1-33.92-18.4 34.4 34.4 0 0 1 0-36.64A40.16 40.16 0 0 1 80 918.24h880a39.84 39.84 0 0 1 34.08 18.4 34.08 34.08 0 0 1 0.64 36.8zM545.44 688a272 272 0 0 1-148 68.64l-96 7.84c-46.24 3.84-71.68 5.92-76.48 5.92a36.96 36.96 0 0 1-26.24-10.72c-12.64-12.48-12.64-12.48-5.12-102.56l8-96a272 272 0 0 1 68.64-148l352-351.2a113.28 113.28 0 0 1 155.84 0l118.88 118.88a109.92 109.92 0 0 1 0 155.36z m299.52-455.2l-118.88-118.88a37.12 37.12 0 0 0-51.84 0l-352 352a195.52 195.52 0 0 0-48 102.24l-8 96-2.56 30.88 30.88-2.56 96-8a196.64 196.64 0 0 0 102.24-48l352-351.04a37.12 37.12 0 0 0 0-51.84z"></path></svg>
            </span>
          </div>
        </el-upload>
        <!-- 描述输入框 -->
        <div class="context">
          <el-input class="title" v-model="name" placeholder="请输入内容"></el-input>
          <el-input
            class="description"
            type="textarea"
            resize='none'
            :rows="7"
            v-model="description"
            placeholder="请输入内容"
          >
          </el-input>
        </div>
      </div>
      <!-- 对话框底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/mixin";
$min-height: 400px;
$action-height: 5rem;
.music-form{
  position: relative;
  z-index: 1;
  .head{
    min-height: $min-height;
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
      min-width: 180px;
      min-height: 180px;
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
        color: var(--info-text);
      }
    }
  }
  .context{
    width: 100%;
    height: 100%;
    position: relative;
    .gradual-block{
      height: calc(100vh - $min-height);
      position: absolute;
      z-index: 1;
      float: left;
      width: 100%;
      background-image: linear-gradient(rgba(0, 0, 0, .4) 0, var(--main-background-color) 100%);
    }
    .album-plank{
      display: flex;
      align-items: center;
      width: 100%;
      z-index: 10;
      height: $action-height;
      position: relative;
    }
    .musicList{
      min-height: calc(100vh - $min-height - $action-height - 35px);
      width: 100%;
      padding: 0 20px 0 20px;
      position: relative;
      margin: 1rem 0 5rem 0;
      z-index: 10;
    }
  }
}
.el-dialog__wrapper{
  ::v-deep .el-dialog{
    background-color: var(--aside-background-color);
    .el-dialog__title{
      color: var(--text-color);
    }
  }
}

.upload{
  .img{
    border-radius: 5px;
    position: relative;
    width: 100%;
    height: 100%;
    display: block;
  }
  .change-icon{
    border-radius: 5px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon{
      width: 50px;
      height: 50px;
      fill: var(--playlist-img-fill);
    }
    &:hover{
      background-color: rgb(0 0 0 / 30%);
      opacity: 1;
      transition: all .2s;
    }
  }
}
.context{
  width: 250px;
  @include updateInput();
  .title{
    margin-bottom: 2px;
  }
}
</style>
