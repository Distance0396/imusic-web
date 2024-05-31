<template>
  <el-container>
    <el-container id="container">
      <el-aside width="250px" id="el-aside" style="height: 100vh">
        <Navbar></Navbar>
      </el-aside>
      <el-main style="overflow:hidden; z-index: 1">
        <Header></Header>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer id="el-footer" >Footer</el-footer>
  </el-container>
</template>

<script>
import Header from '@/components/header.vue'
import Navbar from '@/components/navbar.vue'
export default {
  name: 'LayoutIndex',
  components: {
    Header,
    Navbar
  },
  data () {
    return {
    }
  },
  methods: {

  },
  created () {

  },
  computed: {

  }
}
</script>

<style scoped lang="less">
#el-aside{
  display: flex;
  flex-direction: column;
  background-color: rgb(242,243,245);
  border-right: #d0d0d0 2px solid;
  position: fixed;
}
el-footer{
  position: fixed;
  bottom: 0;
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
  bottom: 0;
  width: 100%;
}
</style>
