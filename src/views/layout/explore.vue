<template>
  <div class="explore">
    <span class="title">歌手</span>
    <div class="item-list">
      <loopItem v-for="item in singer" :key="item" :detail="item"></loopItem>
      <i></i><i></i><i></i><i></i>
    </div>
  </div>
</template>
<script>
import loopItem from '@/components/bolck/LoopItem.vue'
import { getSingerList } from '@/api/singer'
export default {
  name: 'exploreIndex',
  components: {
    loopItem
  },
  data () {
    return {
      singer: []
    }
  },
  methods: {
    async getSingerList () {
      const { data } = await getSingerList()
      this.singer = data
    }
  },
  created () {
    this.getSingerList()
  }
}
</script>
<style scoped lang="less">
.explore{
  margin-top: 60px;
  margin-left: 20px;
  .title{
    font-size: 5vh;
    //margin-bottom: 100vh;
  }
  .item-list > i{
    width: 23vh;
    margin-right: 20px;
  }
  .item-list{
    margin-top: 2vh;
    display: flex;
    flex-wrap: wrap;
    //justify-content: space-between;
    //display: grid;
    //grid-gap: 3vh 2vh;
    //grid-template-columns: repeat(auto-fill, 27vh);
    .block{
      //margin-right: 10px;
      //margin-bottom: 10px;
      //margin: 1vh 0;
    }
    .block:last-child{
      margin-right: auto;
    }
  }
}
</style>
