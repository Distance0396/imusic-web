<script>
import Block from '@/components/bolck/Block.vue'
import ScrollBar from '@/components/layout/ScrollBar.vue'
import { getSearchHistory } from '@/utils/storage'
export default {
  name: 'historyBar',
  components: {
    Block, ScrollBar
  },
  data () {
    return {
      history: getSearchHistory()
    }
  },
  methods: {
    click () {
      console.log('123')
    }
  }
}
</script>

<template>
  <ScrollBar style="margin-top: 30px">
    <template #title>
      <i>最近搜索</i>
    </template>
    <template #body>
<!--      <div class="history">-->
        <div class="historyList">
          <Block v-for="item in history" :key="item.id">
            <template #img>
              <img :src="item.avatar || item.image"
                   v-if="item.language"
                   style="width: 100%;
                   height: 100%;
                   cursor: pointer;
                   border-radius: 50%;
                   object-fit: cover;"
                   alt=""
                   @click="$router.push(`/detail/singer/${item.id}`)"
              >
              <img :src="item.avatar || item.image"
                   v-else
                   style="width: 100%;
                   height: 100%;
                   cursor: pointer;
                   border-radius: 5px;
                   object-fit: cover;"
                   alt=""
                   @click="$router.push(`/detail/album/${item.id}`)"
              >
            </template>
            <template #nameOne>
              <i v-if="item.language" @click="$router.push(`/detail/singer/${item.id}`)">{{item.name}}</i>
              <i v-else @click="$router.push(`/detail/album/${item.id}`)">{{item.name}}</i>
            </template>
            <template #nameTwo>
              <i v-if="item.language" @click="$router.push(`/detail/singer/${item.id}`)">艺人</i>
              <i v-else>{{item.singerName}}</i>
            </template>
          </Block>
        </div>
<!--      </div>-->
    </template>
  </ScrollBar>
</template>

<style scoped lang="less">
.history{
  .historyList{
    display: flex;
  }
}
</style>
