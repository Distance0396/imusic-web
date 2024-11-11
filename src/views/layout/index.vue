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
      <el-footer style="height: px;">
        <Footer />
      </el-footer>
    </el-main>
  </el-container>
</template>

<script>
import Navbar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'LayoutIndex',
  components: { Navbar, Footer },
  computed: {
    ...mapState('common', ['asideWidth']),
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
    // ...mapActions('common', ['query']),
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
  }
  // created () { this.query() }
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
    //background-color: rgb(242,243,245);
    //transition: all .1s ease-in-out;
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
</style>
