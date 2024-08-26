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
    },
    delHistory () {
      console.log('123')
      this.$emit('del-history')
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
          <span
            v-if="this.$router.history.current.fullPath === '/explore/search'"
            @click="delHistory"
            class="del" style="position: absolute; right: -5px; top: -5px;">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M806.4 263.2l-45.6-45.6L512 467.2 263.2 217.6l-45.6 45.6L467.2 512 217.6 760.8l45.6 45.6L512 557.6l248.8 248.8 45.6-45.6L557.6 512z" p-id="5316"></path></svg>
          </span>
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
    width: 8.5rem;
    height: 8.5rem;
    margin-bottom: 10px;
    position: relative;
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
