<script>
export default {
  name: 'blockIndex',
  data () {
    return {
      loading: true
    }
  },
  props: {
    detail: Object
  },
  methods: {
    changeLoad () {
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  },
  mounted () {
    this.changeLoad()
  }
}
</script>

<template>
  <el-skeleton :loading="loading" animated class="block">
    <template slot="template">
      <div class="block-loading">
        <span class="block-img-garden public">
        <el-skeleton-item
          variant="image"
          style="width: 100%; height: 100%;"/>
      </span>
        <span class="block-name">
          <el-skeleton-item variant="h3" style="width: 50%;" />
        </span>
        <span class="blockSingerName" style="font-size: 0.75rem">
          <el-skeleton-item variant="h3" style="width: 100%;" />
        </span>
      </div>
    </template>
    <template>
      <span class="block-img-garden public"  @click="$router.push(`/detail/singer/${detail.id}`)">
        <img :src="detail.avatar || detail.image" alt="">
      </span>
      <span class="block-name" @click="$router.push(`/detail/singer/${detail.id}`)">
        <i>{{detail.name}}</i>
      </span>
      <span style="font-size: 0.75rem">艺人</span>
    </template>
  </el-skeleton>
</template>

<style scoped lang="less">
.block{
  padding: 9px 9px;
  margin: 1px;
  display: inline-flex;
  flex-direction: column;
  background-color: #f7f7f7;
  border-radius: 5px;
  justify-content: center;
  &:hover{
    background-color: #d0d0d0;
    transition: background-color .4s;
  }
  .block-loading{
    display: inline-flex;
    flex-direction: column;
    background-color: #f7f7f7;
    border-radius: 5px;
    justify-content: center;
    &:hover{
      background-color: #d0d0d0;
      transition: background-color .4s;
    }
  }
  .public{
    //width: 20vh;
    //height: 20vh;
    width: 9rem;
    height: 9rem;
    //max-width: 300px;
    //max-height: 300px;
    min-width: 120px;
    min-height: 120px;
  }
  .block-img-garden{
    margin-bottom: 10px;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: cover;
    }
  }
  .block-name{
    font-size: 1rem;
    i:hover{
      text-decoration: underline;
      transition: text-decoration .9s;
    }
  }
}

</style>
