<script>
export default {
  name: 'blockIndex',
  data () {
    return {
      // type: true,
      num: 0
    }
  },
  props: {
    type: Boolean
  }
}
</script>

<template>
  <div class="block">
    <a href="/" class="block-img" v-if="type">
      <img src="../style/image/distance.png" alt="">
    </a>
    <a href="/" class="block-img-garden" v-else>
      <img src="../style/image/distance.png" alt="">
    </a>
    <a>Distance</a>
    <a href="" class="block-name">
      <i>宇多田光</i>
    </a>
  </div>
</template>

<style scoped lang="less">
.music_from {
  display: flex;
  justify-content: space-between;
  align-items: center;

  i {
    font-size: 2rem;
  }

  .music_from_right {
    margin-left: auto;

    .rolling {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: rgb(229, 230, 235);
      margin-left: 10px;
      border-radius: 50%;
    }

    span:nth-child(2) {
      svg {
        transform: rotate(180deg);
      }
    }
  }
}

.music_form_item {
  display: flex;
  flex-wrap: nowrap;
  scrollbar-width: none;
  align-items: center;
  margin-top: 10px;
  overflow: hidden;
  .item {
    display: inline-flex;
    flex-wrap: nowrap;
    translate: 0px;
    transition: translate .9s ease;
    .block:hover{
      background-color: #d0d0d0;
      transition: background-color .4s;
    }
    .block{
      padding: 10px 10px;
      margin: 1px;
      display: inline-flex;
      flex-direction: column;
      background-color: #f7f7f7;
      border-radius: 5px;
      .block-img{
        width: 150px;
        height: 150px;
        margin-bottom: 10px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 5px;
          cursor: pointer;
        }
      }
      .block-img-garden{
        width: 150px;
        height: 150px;
        margin-bottom: 10px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          cursor: pointer;
        }
      }
      .block-name{
        font-size: 0.8rem;
        i:hover{
          text-decoration: underline;
          transition: text-decoration .9s;
        }
      }
    }
  }
}

</style>
