<template>
  <div id="app">
<!--    <keep-alive include="playerItem">-->
    <router-view :key="key"/>
<!--    </keep-alive>-->
<!--    <layout></layout>-->
    <player></player>
  </div>
</template>
<script>
import player from '@/components/player.vue'
// import layout from '@/views/layout/index.vue'
export default {
  components: {
    // layout
    player
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
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

</script>
<style lang="less">

</style>
