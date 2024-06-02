<template>
  <div id="app">
    <router-view :key="key"/>
  </div>
</template>
<script>
export default {
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
