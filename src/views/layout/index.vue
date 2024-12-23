<template>
  <el-container class="container">
    <el-aside class="el-aside" ref="aside" :style="{ width: this.asideWidth + 'px' }" style="height: 100vh;">
      <Navbar />
      <div class="resizer" @mousedown="startResize"></div>
    </el-aside>
    <el-main class="el-main" :style="{ marginLeft: this.asideWidth + 'px' }">
      <transition name="component-fade" mode="out-in">
        <router-view :key="key" />
      </transition>
      <el-footer>
        <Footer />
      </el-footer>
      <div class="UserInfoFloat" :style="{top: `${getY}px`, left: `${getX}px` }" v-show="getIsFocus">
        <div style="display: flex; margin-bottom: 5px; align-items: center;">
          <el-avatar :src="focusUser?.avatar"></el-avatar>
          <p style="margin-left: 10px;">{{focusUser?.name}}</p>
        </div>
        <div style="font-size: 13px; color: #848484; margin-bottom: 10px;">@{{focusUser?.account}}</div>
        <div>
          {{focusUser?.sign}}
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Navbar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'LayoutIndex',
  components: { Navbar, Footer },
  computed: {
    ...mapState('common', ['asideWidth', 'isFocus', 'focusUser']),
    ...mapGetters('common', ['getY', 'getX', 'getIsFocus']),
    // ...mapState('common', ['y', 'x', 'focusUser']),
    // key () {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
    key () { return this.$route.fullPath || 'default-route' }
  },
  data () {
    return {
      isResizing: false
    }
  },
  methods: {
    ...mapActions('user', ['getUserAndSetting']),
    ...mapMutations('common', ['setAsideWidth']),
    startResize (event) {
      // 开始拖动时设置标记
      this.isResizing = true
      document.addEventListener('mousemove', this.resize)
      document.addEventListener('mouseup', this.stopResize)
    },
    resize (event) {
      if (this.isResizing) {
        // 获取鼠标位置并更新 aside 的宽度
        const newWidth = event.clientX
        // 当宽度小于等于200px时，直接设置为100px
        if (newWidth <= 160) {
          this.setAsideWidth(80)
          document.querySelector('.el-main').style.setProperty('--width', '80px')
        } else if (newWidth > 300) {
          this.setAsideWidth(400)
          document.querySelector('.el-main').style.setProperty('--width', '400px')
        } else {
          this.setAsideWidth(newWidth)
          document.querySelector('.el-main').style.setProperty('--width', `${newWidth}px`)
        }
      }
    },
    stopResize () {
      // 停止拖动，移除事件监听
      this.isResizing = false
      document.removeEventListener('mousemove', this.resize)
      document.removeEventListener('mouseup', this.stopResize)
    }
  },
  mounted () {
    this.getUserAndSetting()
  },
  created () {
    // this.$EventBus.$on('focusAvatar', ({ userInfo, x, y }) => {
    //   document.querySelector('.UserInfoFloat').style.setProperty('--width', `${x}px`)
    //   document.querySelector('.UserInfoFloat').style.setProperty('--height', `${y}px`)
    // })
  }
}
</script>

<style scoped lang="scss">
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .2s ease;
}
.component-fade-enter, .component-fade-leave-to{
  opacity: 0;
}
.container{
  width: 100%;
  .el-aside{
    position: fixed;
    display: flex;
    flex-direction: column;
    background-color: var(--aside-background-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    .resizer {
      width: 5px;
      cursor: grab;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      transition: all .1s ease-in-out;
      &:hover{
        background-color: #ccc;
      }
    }
  }
  .el-main{
    overflow: hidden;
    position: relative;
    width: calc(100% - var(--width));
    padding: 0 0 0 0;
    background-color: var(--main-background-color);
  }
}
.UserInfoFloat{
  width: 300px;
  height: 150px;
  border: 0 solid black;
  background-color: black;
  position: fixed;
  color: var(--text-color);
  z-index: 10000;
  border-radius: 4px;
  padding: 10px 10px;
  transition: all .5s ease-out;
}
</style>
