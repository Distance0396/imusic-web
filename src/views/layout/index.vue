<template>
  <el-container class="subject">
    <el-container id="container">
      <el-aside width="250px" id="el-aside" style="height: 100vh">
        <Navbar></Navbar>
      </el-aside>
      <el-main style="overflow:hidden; z-index: 1; padding: 0 0 60px 0">
        <Header></Header>
        <keep-alive>
          <router-view :key="key"></router-view>
        </keep-alive>
      </el-main>
    </el-container>
<!--    <el-footer id="el-footer" style="height: 70px">-->
<!--      <Player></Player>-->
<!--    </el-footer>-->
  </el-container>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import Navbar from '@/components/layout/NavBar.vue'
// import Player from '@/components/player.vue'
export default {
  name: 'LayoutIndex',
  components: {
    Header,
    Navbar
    // Player
  },
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style scoped lang="less">
.subject{
  //min-width: 800px;
  #el-aside{
    display: flex;
    flex-direction: column;
    background-color: rgb(242,243,245);
    border-right: #d0d0d0 2px solid;
    position: fixed;
  }
  .el-main{
    padding: 0 0 0 0;
    width: 100%;
    //max-width: 86rem;
    margin-left: 250px;
    .header{
      padding-right: 5px;
    }
  }
  #el-footer{
    position: fixed;
    //top: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
    min-width: 800px;
    background-color: #303133;
  }
}
</style>
