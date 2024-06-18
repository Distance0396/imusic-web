<template>
  <div class="explore">
    <span class="title">歌手</span>
    <div class="item-list">
      <Block v-for="item in singer" :key="item.id" >
        <template #img>
          <el-image
            :src="item.avatar || item.image"
            style="width: 100%;
            height: 100%;
            cursor: pointer;
            border-radius: 50%;
            object-fit: cover;"
            fit="cover"
            :lazy="true"
            alt=""
            @click="$router.push(`/detail/singer/${item.id}`)"
          ></el-image>
        </template>
        <template #nameOne>
          <i @click="$router.push(`/detail/singer/${item.id}`)">{{item.name}}</i>
        </template>
        <template #nameTwo>
          艺人
        </template>
      </Block>
<!--      <loopItem v-for="item in singer" :key="item" :detail="item"></loopItem>-->
<!--      <i></i><i></i><i></i><i></i>-->
    </div>
  </div>
</template>
<script>
// import loopItem from '@/components/bolck/LoopItem.vue'
import Block from '@/components/bolck/Block.vue'
import { getSingerList } from '@/api/singer'
export default {
  name: 'exploreIndex',
  components: {
    // loopItem
    Block
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
    },
    haha () {
      console.log('123')
    }
  },
  created () {
    this.getSingerList()
  }
}
</script>
<style scoped lang="less">
.explore{
  padding: 60px 20px 0 20px;
  //margin-top: 60px;
  //margin-left: 20px;
  .title{
    font-size: 5vh;
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
