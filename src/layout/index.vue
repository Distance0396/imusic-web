<template>
  <el-container class="container">
    <el-aside
      class="el-aside"
      ref="aside"
      :style="{ width: asideWidth + 'px' }"
    >
      <Navbar />
      <div class="resizer" @mousedown="startResize"></div>
    </el-aside>
    <el-main
      class="el-main"
      :style="{
        marginLeft: asideWidth + 'px',
        '--width': asideWidth + 'px',
        '--el-aside-right-width': $store.state.common.isShowRightBox
          ? '320px'
          : '0px',
      }"
    >
      <keep-alive>
        <router-view :key="key" />
      </keep-alive>
      <el-footer style="margin: 40px 0 0 0">
        <Footer />
      </el-footer>
      <div
        class="UserInfoFloat"
        @mouseover="isShowFloatBox"
        @mouseleave="isHiddenFloatBox"
        :style="{ top: `${getY}px`, left: `${getX}px` }"
        v-show="getIsFocus"
      >
        <div style="display: flex; margin-bottom: 5px; align-items: center">
          <el-avatar :src="focusUser?.avatar"></el-avatar>
          <p style="margin-left: 10px">{{ focusUser?.name }}</p>
        </div>
        <div style="font-size: 13px; color: #848484; margin-bottom: 10px">
          @{{ focusUser?.account }}
        </div>
        <div>
          {{ focusUser?.sign }}
        </div>
      </div>
    </el-main>
    <el-aside v-show="isShowRightBox" class="el-aside-right">
      <PlayList />
    </el-aside>
  </el-container>
</template>

<script>
import Navbar from '@/layout/navbar/NavBar.vue'
import Footer from '@/layout/footer/Footer.vue'
import PlayList from '@/components/layout/PlayList.vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'LayoutIndex',
  components: { Navbar, Footer, PlayList },
  computed: {
    ...mapState('common', ['asideWidth', 'isFocus', 'focusUser']),
    ...mapGetters('common', ['getY', 'getX', 'getIsFocus']),
    key() {
      return this.$route.fullPath || 'default-route'
    },
    isShowRightBox() {
      return this.$store.state.common.isShowRightBox
    },
  },
  data() {
    return {
      isResizing: false,
    }
  },
  methods: {
    ...mapActions('user', ['getUserAndSetting']),
    ...mapMutations('common', ['setAsideWidth', 'setIsFocus']),
    startResize() {
      // 开始拖动时设置标记
      this.isResizing = true
      document.addEventListener('mousemove', this.resize)
      document.addEventListener('mouseup', this.stopResize)
    },
    resize(event) {
      if (this.isResizing) {
        // 获取鼠标位置并更新 aside 的宽度
        const newWidth = event.clientX
        // 当宽度小于等于200px时，直接设置为100px
        if (newWidth <= 160) {
          this.setAsideWidth(80)
          document
            .querySelector('.el-main')
            .style.setProperty('--width', '80px')
        } else if (newWidth > 300) {
          this.setAsideWidth(400)
          document
            .querySelector('.el-main')
            .style.setProperty('--width', '400px')
        } else {
          this.setAsideWidth(newWidth)
          document
            .querySelector('.el-main')
            .style.setProperty('--width', `${newWidth}px`)
        }
      }
    },
    stopResize() {
      // 停止拖动，移除事件监听
      this.isResizing = false
      document.removeEventListener('mousemove', this.resize)
      document.removeEventListener('mouseup', this.stopResize)
    },
    isShowFloatBox() {
      this.setIsFocus(true)
    },
    isHiddenFloatBox() {
      this.setIsFocus(false)
    },
  },
  mounted() {
    this.getUserAndSetting()
    const paths = document.querySelectorAll('.icon .p')
    paths.forEach(path => {
      const len = path.getTotalLength()
      path.style.setProperty('--l', len)
    })
  },
  created() {
    // this.$EventBus.$on('focusAvatar', ({ userInfo, x, y }) => {
    //   document.querySelector('.UserInfoFloat').style.setProperty('--width', `${x}px`)
    //   document.querySelector('.UserInfoFloat').style.setProperty('--height', `${y}px`)
    // })
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/mixin';
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.2s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
.container {
  width: 100%;
  .el-aside {
    height: 100vh;
    position: fixed;
    display: flex;
    flex-direction: column;
    background-color: var(--aside-background-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-right-color: var(--border-color);
    border-style: solid;
    border-width: 0 0.0625rem 0 0;
    .p {
      stroke: #409eff;
      stroke-width: 1;
      stroke-dasharray: var(--l);
      stroke-dashoffset: var(--l);
      fill: none;
      stroke-linecap: round;
      animation: stroke 4s forwards;
    }
    @keyframes stroke {
      to {
        stroke-dashoffset: 0;
      }
    }
    @include respond-to('phone') {
      //display: none;
      width: 80px;
    }
    @include respond-to('tv') {
      width: 250px;
    }
    .resizer {
      width: 4px;
      cursor: grab;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      transition: all 0.1s linear;
      &:hover {
        background-color: rgba(134, 134, 134, 0.2);
      }
    }
  }
  .el-main {
    overflow: hidden;
    position: relative;
    max-width: calc(100vw - var(--width) - var(--el-aside-right-width));
    padding: 0 0 0 0;
    background-color: var(--main-background-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-right-color: var(--border-color);
    border-style: solid;
    border-width: 0 0.0625rem 0 0;
  }
  .el-aside-right {
    height: 100vh;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-left-color: var(--border-color);
    border-style: solid;
    border-width: 0 0 0 0.0625rem;
    right: 0;
    z-index: 999;
  }
}
.UserInfoFloat {
  width: 300px;
  height: 150px;
  background-color: var(--aside-background-color);
  pointer-events: auto;
  position: fixed;
  color: var(--text-color);
  z-index: 10000;
  border-radius: 4px;
  padding: 10px 10px;
  transition: all 0.5s ease-out;
}
</style>
