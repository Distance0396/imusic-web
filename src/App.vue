<template>
  <div id="app" class="app">
    <router-view />
    <player v-show="isHidden" />
  </div>
</template>
<script>
import player from '@/components/player/player.vue'
export default {
  components: {
    player
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  methods: {
    toggleTheme () {
      const res = localStorage.getItem('theme')
      // const newTheme = this.isDarkMode ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', res !== null ? res : 'dark')
      localStorage.setItem('theme', res !== null ? res : 'dark')
    }
  },
  data () {
    return {
      isHidden: true,
      isDarkMode: false
    }
  },
  watch: {
    $route: {
      handler (val, old) {
        this.isHidden = !(val.path === '/404' || val.path === '/login')
      }
    }
  },
  created () {
    // document.onselectstart = function () {
    //   return false
    // }
    // document.oncontextmenu = function () {
    //   return false
    // }
    // document.ondragstart = function () {
    //   return false
    // }
    // document.onselect = function () {
    //   return false
    // }
    this.toggleTheme()
  }
}
</script>
<style lang="scss">
html{
  background-color: var(--main-background-color);
}
.app{
  margin: 0 auto;
}
</style>
