<template>
  <el-container>
    <el-container>
      <el-aside width="250px">
        <Navbar></Navbar>
      </el-aside>
      <el-main width="1000px">
        <div class="header">
          <Header></Header>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer>Footer</el-footer>
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
  }
}
</script>

<style scoped lang="less">
el-aside{
  display: flex;
  flex-direction: column;
  background-color: rgb(242,243,245);
  height: 100%;
  width: 250px;
  border-right-width: 1px;
  position: fixed;
  left: 0;
  top: 0;

}
el-main{
  padding: 0 20px 0 20px;
  //width: 1000px;
}

el-main{
  max-width: 86rem;
  position: fixed;
  left: 250px;
  .header{
    padding-right: 5px;
  }
}
</style>
