<script>
import Header from '@/components/layout/Header.vue'
export default {
  name: 'PlayListLayout',
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
  <div style="height: calc(100vh - 40px); background-color: var(--main-background-color)">
    <Header></Header>
    <router-view :key="key"/>
  </div>
</template>

<style scoped lang="scss">

</style>
