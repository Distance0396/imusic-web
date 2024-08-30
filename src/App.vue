<template>
  <div id="app">
<!--    <keep-alive include="albumDetail">-->
      <router-view />
<!--    </keep-alive>-->
    <player v-if="isHidden"></player>
  </div>
</template>
<script>
import player from '@/components/player.vue'
export default {
  components: {
    player
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  data () {
    return {
      isHidden: true
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
    document.onselectstart = function () {
      return false
    }
    document.oncontextmenu = function () {
      return false
    }
    document.ondragstart = function () {
      return false
    }
    document.onselect = function () {
      return false
    }
  }
}
</script>
<style lang="scss">

</style>
