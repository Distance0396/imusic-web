<script>
export default {
  name: 'contextMenu',
  mounted () {
    this.$refs.containerRef.addEventListener('contextmenu', this.handleContextMenu)
    window.addEventListener('contextmenu', this.closeMenu, true)
    window.addEventListener('click', this.closeMenu, true)
  },
  beforeDestroy () {
    this.$refs.containerRef.removeEventListener('contextmenu', this.handleContextMenu)
    window.removeEventListener('contextmenu', this.closeMenu, true)
    window.removeEventListener('click', this.closeMenu, true)
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    position: {
      type: Object
    }
  },
  watch: {
    position: {
      handler (newVal) {
        this.handleContextMenu(newVal)
      }
    }
  },
  methods: {
    select (e) {
      return this.$emit('select-menu', e)
    },
    handleContextMenu (e) {
      e.preventDefault()
      e.stopPropagation()
      this.showMenu = true
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const menuWidth = 170
      const menuHeight = 210

      if (e.clientY + menuHeight > viewportHeight) {
        this.y = e.clientY - menuHeight
      } else {
        this.y = e.clientY
      }

      if (e.clientX + menuWidth > viewportWidth) {
        this.x = e.clientX - menuWidth
      } else {
        this.x = e.clientX
      }
    },
    sonMenuStyle (e) {
      const viewportWidth = window.innerWidth
      const menuWidth = 170
      const subMenuWidth = 150

      let left = this.x + menuWidth
      if (left + subMenuWidth > viewportWidth) {
        left = this.x - subMenuWidth
      }

      return {
        left: `${left}px`,
        top: `${this.y}px`
      }
    },
    closeMenu () {
      this.showMenu = false
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
    <div v-show="showMenu" class="context-menu" :style="{left: x + 'px',top: y + 'px'}">
      <ul class="context-list">
        <li class="menu"
             v-for="item in menu"
             :key="item.label"
             @click="select(item.label)"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
          <i style="" v-if="item.menu" class="el-icon-arrow-right"></i>
          <ul class="son-context" :style="sonMenuStyle()">
            <li class="son-menu"
                v-for="sonItem in item.menu"
                :key="sonItem.id"
                @click.stop="select(sonItem)"
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
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1000;
  .context-list{
    padding: 3px;
    .menu{
      cursor: pointer;
      color: #C0C4CC;
      padding: 10px 10px 10px 0;
      &:hover{
        background-color: #717171;
        transition: all .3s;
        border-radius: 3px;
        .son-context{
          display: block;
        }
      }
      i{
        margin: 0 10px;
      }
      .son-context{
        display: none;
        //width: 100%;
        width: 150px;
        position: fixed;
        background-color: #303133;
        border-radius: 3px;
        box-shadow: 1px 1px 2px rgba(0,0,0,1.2), -1px 1px 2px rgba(0,0,0,1.2);
        white-space: nowrap;
        overflow: hidden;
        z-index: 1000;
        .son-menu{
          width: 100%;
          cursor: pointer;
          color: #C0C4CC;
          padding: 10px 10px 10px 10px;
          &:hover{
            background-color: #717171;
            transition: all .5s;
            border-radius: 3px;
          }
        }
      }
    }
  }
}
</style>
