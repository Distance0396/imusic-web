<script>
export default {
  name: 'contextMenu',
  mounted () {
    window.addEventListener('click', this.closeMenu, true)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.closeMenu, true)
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    more: {
      type: Object
    }
  },
  watch: {
    // 点击省略符号
    more: {
      handler (newVal) {
        this.handleContextMenu(newVal)
      }
    }
  },
  methods: {
    // 禁止页面滚动
    disableScroll () {
      window.addEventListener('touchmove', this.preventDefault, { passive: false })
    },
    // 允许页面滚动
    enableScroll () {
      window.removeEventListener('touchmove', this.preventDefault, { passive: false })
    },
    // 阻止 touchmove 事件的默认行为
    preventDefault (event) {
      event.preventDefault()
    },
    // 子传父选择相
    select (menu, sonItem) {
      return this.$emit('select-menu', {
        menu: menu,
        sonItem: sonItem
      })
    },
    // 计算菜单位置
    handleContextMenu (e) {
      e.stopPropagation()
      e.preventDefault()
      this.disableScroll()
      this.showMenu = true

      this.$nextTick(() => {
        const menuElement = this.$refs.menuContainer
        const { clientX, clientY } = e

        // 获取菜单实际尺寸
        const { width: menuWidth, height: menuHeight } =
          menuElement.getBoundingClientRect()

        // 自动避让屏幕边缘
        this.x = clientX + menuWidth > window.innerWidth
          ? window.innerWidth - menuWidth - 5 // 留5px间隙
          : Math.max(clientX, 5) // 防止左侧溢出

        this.y = clientY + menuHeight > window.innerHeight
          ? window.innerHeight - menuHeight - 5
          : Math.max(clientY, 5)
      })

      // const menuElement = this.$refs.menuElement
      // const { clientX, clientY } = e
      //
      // // 使用requestAnimationFrame保证DOM更新
      // requestAnimationFrame(() => {
      //   const { offsetWidth: menuWidth, offsetHeight: menuHeight } = menuElement
      //   this.x = clientX + menuWidth > window.innerWidth
      //     ? window.innerWidth - menuWidth
      //     : clientX
      //
      //   this.y = clientY + menuHeight > window.innerHeight
      //     ? window.innerHeight - menuHeight
      //     : clientY
      // })
    },
    // 子菜单显示
    sonShow (e) {
      const menuItem = e.currentTarget
      const sonContext = menuItem.querySelector('.son-context')
      sonContext.style.display = 'block'

      this.$nextTick(() => {
        // 获取所有相关元素尺寸
        const parentRect = menuItem.getBoundingClientRect()
        const subMenuRect = sonContext.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // 水平方向计算
        let left = parentRect.right
        if (left + subMenuRect.width > viewportWidth) {
          left = parentRect.left - subMenuRect.width
        }
        left = Math.max(left, 5)

        // 垂直方向计算
        let top = parentRect.top
        if (top + subMenuRect.height > viewportHeight) {
          top = viewportHeight - subMenuRect.height - 5
        }
        top = Math.max(top, 5)

        // 应用最终位置
        sonContext.style.left = `${left}px`
        sonContext.style.top = `${top}px`
      })

      // const rect = menuItem.getBoundingClientRect()
      // const menuItemRight = rect.right
      // const menuItemTop = rect.top
      //
      // const subMenuWidth = 150
      // const subMenuHeight = sonContext.scrollHeight
      //
      // let left = menuItemRight
      // if (left + subMenuWidth > window.innerWidth) {
      //   left = rect.left - subMenuWidth
      // }
      //
      // let top = menuItemTop
      // if (top + subMenuHeight > window.innerHeight) {
      //   top = Math.max(0, window.innerHeight - subMenuHeight)
      // }
      //
      // sonContext.style.left = `${left}px`
      // sonContext.style.top = `${top}px`
    },
    // 隐藏子菜单
    hideSubMenu (e) {
      const sonContext = e.currentTarget.querySelector('.son-context')
      setTimeout(() => {
        sonContext.style.display = 'none'
        sonContext.style.left = ''
        sonContext.style.top = ''
      }, 100)
    },
    // 关闭菜单
    closeMenu () {
      const menuContainer = this.$refs.menuContainer
      if (menuContainer && menuContainer.contains(event.target)) {
        return
      }
      this.enableScroll()
      this.showMenu = false
      // this.enableScroll()
      // this.showMenu = false
    }
  },
  data () {
    return {
      x: 0,
      y: 0,
      showMenu: false
    }
  }
}
</script>

<template>
  <div ref="containerRef">
    <slot></slot>
    <div v-show="showMenu" class="context-menu" ref="menuContainer" :style="{left: x + 'px',top: y + 'px'}">
      <ul class="context-list">
        <li class="menu"
            ref="menuElement"
            v-for="item in menu" :key="item.label" :data-son="item.menu!==null"
            @click="select(item)"
            @mouseover="sonShow"
            @mouseleave="hideSubMenu"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
          <i v-show="item.menu" class="el-icon-arrow-right"></i>
          <ul class="son-context" style="display: none;">
            <li class="son-menu"
                v-for="sonItem in item.menu" :key="sonItem.id"
                @click.stop="select(item, sonItem)"
            >{{ sonItem.name }}</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.context-menu{
  width: 170px;
  position: fixed;
  background-color: #212830;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1000;
  box-shadow: 2px 2px 20px -5px black;
  .context-list{
    padding: 3px;
    .menu{
      cursor: pointer;
      color: #C0C4CC;
      padding: 10px 0 10px 0;
      &:hover {
        background-color: #717171;
        transition: all .3s;
        border-radius: 3px;
      }
      i{
        margin: 0 10px;
      }
      .son-context{
        width: 150px;
        position: fixed;
        left: 0;
        top: 0;
        background-color: #303133;
        border-radius: 3px;
        box-shadow: 2px 2px 20px -5px black;
        white-space: nowrap;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        &::-webkit-scrollbar {
          background-color: #0f1011;
        }
        &::-webkit-scrollbar-track {
          background-color: #303133;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #202021;
        }
        .son-menu{
          width: 100%;
          cursor: pointer;
          color: #C0C4CC;
          padding: 10px 10px 10px 10px;
          &:hover{
            background-color: #717171;
            border-radius: 3px;
          }
        }
      }
    }
  }
}
</style>
