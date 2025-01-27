<script>
import Header from '@/components/layout/Header.vue'
export default {
  name: 'ExploreLayout',
  components: {
    Header
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<template>
  <div class="explore">
    <Header></Header>
    <keep-alive include="searchObject">
      <router-view :key="key"/>
    </keep-alive>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/index";
.explore{
  min-height: calc(100vh - $footer);
}
</style>
