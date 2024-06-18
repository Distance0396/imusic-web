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
    }
  },
  methods: {
    select (e) {
      return this.$emit('select', e)
    },
    handleContextMenu (e) {
      e.preventDefault()
      e.stopPropagation()
      this.showMenu = true
      if (e.clientY > 300) {
        this.y = e.clientY - 200
      } else {
        this.y = e.clientY
      }
      if (e.clientX > 1250) {
        this.x = e.clientX - 170
      } else {
        this.x = e.clientX
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
    <div v-show="showMenu" class="context-menu" :style="{
        left: x + 'px',
        top: y + 'px'
    }">
      <ul class="context-list">
        <li class="menu"
             v-for="item in menu"
             :key="item.label"
             @click="select(item.label)"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
          <i style="" v-if="item.menu" class="el-icon-arrow-right"></i>
          <ul class="son-context" :style="{
            left: x + 167 + 'px',
            top: y + 'px'
          }">
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

<style scoped lang="less">
.context-menu{
  width: 170px;
  position: fixed;
  background-color: #303133;
  border-radius: 3px;
  box-shadow: 1px 1px 2px rgba(0,0,0,1.2), -1px 1px 2px rgba(0,0,0,1.2);
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
          opacity: 1;
        }
      }
      i{
        margin: 0 10px;
      }
      .son-context{
        opacity: 0;
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
