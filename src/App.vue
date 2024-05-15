<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
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
