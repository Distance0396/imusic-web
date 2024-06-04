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
          <span class="block-img">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 100%;"
            />
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
        <span class="block-img" @click="$router.push(`/detail/album/${detail.id}`)">
          <img :src="detail.image" alt="" class="img">
        </span>
        <span class="block-name">
          <i>{{detail.name}}</i>
        </span>
        <span @click="$router.push(`/detail/singer/${detail.singerId}`)" class="blockSingerName" style="font-size: 0.75rem">{{detail.singerName}}</span>
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
  &:hover{
    background-color: #d0d0d0;
    transition: background-color .4s;
  }
  .block-img{
    width: 23vh;
    height: 23vh;
    min-width: 120px;
    min-height: 120px;
    margin-bottom: 10px;
    .img{
      display: flex;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .block-name{
    font-size: 1rem;
    i:hover{
      text-decoration: underline;
      transition: text-decoration 1s;
    }
  }
}
</style>
