<script>
import Header from '@/layout/header/Header.vue'
export default {
  name: 'ExploreLayout',
  components: {
    Header,
  },
  computed: {
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date()
    },
  },
}
</script>

<template>
  <div class="explore">
    <Header></Header>
    <keep-alive include="searchObject">
      <router-view :key="key" />
    </keep-alive>
  </div>
</template>

<style scoped lang="scss"></style>
