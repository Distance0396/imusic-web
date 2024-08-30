<template>
  <div class="explore" v-title data-title="歌手列表">
    <span class="tab">
      <span class="title">歌手</span>
      <el-button-group>
        <el-button size="small" data-language="all" plain type="primary" @click="language">全部</el-button>
        <el-button size="small" data-language="chinese" plain type="primary" @click="language">华语</el-button>
        <el-button size="small" data-language="japanese" plain type="primary" @click="language">日语</el-button>
        <el-button size="small" data-language="english" plain type="primary" @click="language">英语</el-button>
      </el-button-group>
    </span>
    <div class="item-list">
      <Block v-for="item in singer" :key="item.id" >
        <template #img>
          <el-image
            v-if="item.avatar !== undefined || item.image !== undefined"
            :src="item.avatar || item.image"
            style="width: 100%;
            height: 100%;
            cursor: pointer;
            border-radius: 50%;"
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
    </div>
  </div>
</template>
<script>
import Block from '@/components/bolck/Block.vue'
import { getSingerList } from '@/api/singer'
export default {
  name: 'exploreIndex',
  components: {
    Block
  },
  data () {
    return {
      singer: [],
      res: []
    }
  },
  methods: {
    language (e) {
      switch (e.currentTarget.dataset.language) {
        case 'all':
          this.singer = this.res
          break
        case 'chinese':
          this.singer = this.res.filter(s => s.language === '华语')
          // console.log(this.singer)
          break
        case 'japanese':
          this.singer = this.res.filter(s => s.language === '日语')
          break
        case 'english':
          this.singer = this.res.filter(s => s.language === '英语')
          break
      }
    },
    async getSingerList () {
      const { data } = await getSingerList()
      this.singer = data
      this.res = data
    }
  },
  created () {
    // console.log(this.$router.history.current.fullPath)
    this.getSingerList()
  }
}
</script>
<style scoped lang="scss">
.explore{
  padding: 60px 20px 0 20px;
  //max-width: 1200px;
  .tab{
    display: flex;
    align-items: center;
    .title{
      font-size: 2rem;
    }
    .item-list > i{
      width: 23vh;
      margin-right: 20px;
    }
    .el-button-group{
      display: flex;
      flex-wrap: nowrap;
      margin-left: auto;
    }
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
    }
    .block:last-child{
      margin-right: auto;
    }
  }
}
</style>
