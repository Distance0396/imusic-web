<template>
  <div class="explore" v-title data-title="歌手列表">
    <span class="tab">
      <span class="title">歌手</span>
      <el-select v-model="value" placeholder="全部" @change="language">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </span>
    <div class="item-list">
      <Block v-for="item in singer" :key="item.id" >
        <template #img>
          <el-image
            v-if="item.avatar !== undefined || item.image !== undefined"
            :src="item.avatar || item.image"
            style="width: 100%; height: 100%; cursor: pointer; border-radius: 50%;" fit="cover"
            :lazy="true"
            @click="$router.push(`/singer/${item.id}`)"
          />
        </template>
        <template #nameOne>
          <i @click="$router.push(`/singer/${item.id}`)">{{item.name}}</i>
        </template>
        <template #nameTwo>
          艺人
        </template>
      </Block>
    </div>
  </div>
</template>
<script>
import Block from '@/components/block/Block.vue'
import { getSingerList } from '@/api/singer'
export default {
  name: 'exploreIndex',
  components: {
    Block
  },
  data () {
    return {
      singer: [],
      res: [],
      value: '',
      options: [{
        value: 'all',
        label: '全部'
      }, {
        value: 'chinese',
        label: '华语'
      }, {
        value: 'japanese',
        label: '日语'
      }, {
        value: 'english',
        label: '英语'
      }]
    }
  },
  methods: {
    language (e) {
      switch (e) {
        case 'all':
          this.singer = this.res
          break
        case 'chinese':
          this.singer = this.res.filter(s => s.language === '华语')
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
  //min-height: calc(100vh - 40px);
  .tab{
    display: flex;
    align-items: center;
    .title{
      color: var(--text-color);
      font-size: 2rem;
    }
    .item-list > i{
      width: 23vh;
      margin-right: 20px;
    }
    .el-select{
      display: flex;
      flex-wrap: nowrap;
      margin-left: auto;
    }
  }
  .item-list{
    margin-top: 2vh;
    display: flex;
    flex-wrap: wrap;
    .block{
    }
    .block:last-child{
      margin-right: auto;
    }
  }
}
</style>
