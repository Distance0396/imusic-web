<template>
  <div class="header" ref="header">
    <div class="header-left">
      <button class="left-btn" @click="$router.go(-1)">
        <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z" p-id="10562"></path></svg>
      </button>
      <div v-show="scrollTop > 300" style="font-size: 25px; color: #FFFFFF">
        <slot></slot>
      </div>
      <div class="header-option" v-if="$route.matched[1].path === '/explore'">
        <div :class="{ 'item-active' : route.path === $route.path }" class="item" v-for="route in childRoutes" :key="route.path">
          <router-link class="link" :to="route.path">{{ route.meta.title }}</router-link>
        </div>
      </div>
    </div>
    <div class="header-right" >
    </div>
  </div>
</template>

<script>
export default {
  name: 'headerIndex',
  props: {
    color: {
      type: String
    }
  },
  watch: {
    color: {
      handler (newVal, oldVal) {
        window.removeEventListener('scroll', this.handleScroll)
        window.addEventListener('scroll', this.handleScroll)
      }
    }
  },
  data () {
    return {
      scrollTop: ''
      // rout: null
    }
  },
  computed: {
    childRoutes () {
      // 获取当前路由的父级路由的子路由信息
      const exploreRoute = this.getExploreRoute()
      return exploreRoute ? exploreRoute || [] : []
    }
  },
  methods: {
    getExploreRoute () {
      // console.log(this.$router.options.routes)
      // 获取路由配置中的 explore 路由信息
      const exploreRoute = this.$router.options.routes[0].children[1].children
      return exploreRoute || null
    },
    // 页面滚动顶栏变色
    handleScroll () {
      // 计算滚动条位置
      const scrollTop = window.scrollX || document.documentElement.scrollTop || document.body.scrollTop
      this.scrollTop = scrollTop
      // 进行比较设置位置fixed
      if (scrollTop > 300) {
        this.$refs.header.style.backgroundImage = 'linear-gradient(transparent 0, rgba(0, 0, 0, 0.3) 100%)'
        this.$refs.header.style.backgroundColor = this.color
      } else {
        this.$refs.header.style.backgroundImage = 'linear-gradient(transparent 0, rgba(0, 0, 0, 0) 100%)'
        this.$refs.header.style.backgroundColor = '#FFFFFF00'
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped lang="less">
.header{
  padding-left: 20px;
  z-index: 1000;
  position: fixed;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  //opacity: .9;
  .header-left{
    display: flex;
    align-items: center;
    .left-btn{
      align-items: center;
      display: inline-flex;
      justify-content: center;
      background-color: rgb(229,230,235);
      opacity: .8;
      height: 36px;
      width: 36px;
      border-radius: 50%;
      margin-right: 8px;
      //fill: #ffffff;
    }
    .header-option{
      display: flex;
      height: 100%;
      padding:12px 0;
      .item{
        margin-left: 8px;
        padding: 4px 4px;
        .link{
          color: inherit;
          padding: 5px 5px;
          border-radius: 5px;
          font-size: 20px;
        }
        span:hover{
          background-color: rgb(242,243,245);
        }
      }
      .item-active{
        color: #409EFF;
      }
      //.item-nav-slip{
      //  position: absolute;
      //  bottom: 0;
      //  height: 3px;
      //  background-color: rgb(22,93,255);
      //  right: auto;
      //  top: auto;
      //}
    }
  }
}
</style>
