<script>
import Header from '@/components/layout/Header.vue'
export default {
  name: 'replyView',
  components: {
    Header
  }
}
</script>

<template>
  <div v-title data-title="评论">
    <Header></Header>
    <div class="body">
      <div class="info">
        <div class="">
          <div></div>
          <div>
            <span></span>
            <span></span>
          </div>
        </div>
        <span>
          评论
        </span>
      </div>
      <div class="reply"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.body{
  padding: 60px 20px 0px 20px;
  //padding-top: 60px;
  background-color: black;
  height: 100%;
}
</style>
