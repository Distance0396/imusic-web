<template>
  <el-container class="subject">
    <el-container id="container">
      <el-aside width="250px" id="el-aside" style="height: 100vh">
        <Navbar></Navbar>
      </el-aside>
      <el-main>
        <transition name="component-fade" mode="out-in">
          <router-view :key="key"></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// import Header from '@/components/layout/Header.vue'
import Navbar from '@/components/layout/NavBar.vue'
import { mapActions } from 'vuex'
export default {
  name: 'LayoutIndex',
  components: {
    // Header,
    Navbar
    // Player
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  },
  methods: {
    ...mapActions('random', ['query'])
  },
  created () {
    this.query()
  }
}
</script>

<style scoped lang="scss">

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .2s ease;
}
.component-fade-enter, .component-fade-leave-to{
  opacity: 0;
}
.subject{
  height: 100%;
  #el-aside{
    display: flex;
    flex-direction: column;
    background-color: rgb(242,243,245);
    border-right: #d0d0d0 2px solid;
    position: fixed;
  }
  .el-main{
    overflow: hidden;
    z-index: 1;
    height: 100%;
    padding: 0 0 0 0;
    width: 100%;
    margin-left: 250px;
    .header{
      padding-right: 5px;
    }
  }
}
</style>
