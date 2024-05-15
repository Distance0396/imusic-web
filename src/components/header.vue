<template>
  <div class="header">
    <div class="header-left">
      <button class="left-btn">
        <svg t="1715699713789" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10561" width="15" height="15"><path d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z" fill="#000000" p-id="10562"></path></svg>
      </button>
      <div class="header-option">
        <div class="item item-active">
          <span>推荐</span>
        </div>
        <div class="item">
          <span>最新上传</span>
        </div>
        <div class="item-nav-slip"></div>
      </div>
    </div>
    <div class="header-right"></div>
  </div>
</template>

<script>
export default {
  name: 'headerIndex',
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
.header{
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-left{
    display: flex;
    align-items: center;
    .left-btn{
      align-items: center;
      display: inline-flex;
      justify-content: center;
      background-color: rgb(229,230,235);
      opacity: .8;
      height: 36px;
      width: 36px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .header-option{
      display: inline-flex;
      height: 100%;
      padding:12px 0;
      .item{
        margin-right: 8px;
        padding: 8px 8px;
        span{
          padding: 5px 5px;
          border-radius: 5px;
        }
        span:hover{
          background-color: rgb(242,243,245);
        }
      }
      .item-active{
        color: rgb(22,93,255);
      }
      .item-nav-slip{
        position: absolute;
        bottom: 0;
        height: 2px;
        background-color: rgb(22,93,255);
        right: auto;
        top: auto;
      }
    }
  }
}
</style>
