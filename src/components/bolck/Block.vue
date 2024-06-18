<script>
export default {
  name: 'BlockBlock',
  data () {
    return {
      loading: true
    }
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
  <div>
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
        <span class="block-img">
          <slot name="img"></slot>
        </span>
        <span class="block-name">
          <i>
            <slot name="nameOne"></slot>
          </i>
        </span>
        <span class="blockSingerName" style="font-size: 0.75rem">
          <slot name="nameTwo"></slot>
        </span>
      </template>
    </el-skeleton>
  </div>
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
  cursor: pointer;
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
    width: 9rem;
    height: 9rem;
    margin-bottom: 10px;
    //overflow: hidden;
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
