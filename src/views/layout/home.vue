<template>
  <div class="home">
    <div class="song_sheet">
      <div class="music_from">
        <i>歌单</i>
        <div class="music_from_right">
        <span class="rolling-left rolling" @click="rollingLeft">
          <svg t="1715699713789" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="10561" width="15" height="15"><path
            d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"
            fill="#000000" p-id="10562"></path></svg>
        </span>
          <span class="rolling-right rolling" @click="rollingRight">
          <svg t="1715699713789" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="10561" width="15" height="15"><path
            d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"
            fill="#000000" p-id="10562"></path></svg>
        </span>
        </div>
      </div>
      <div class="music_form_item">
        <div class="item">
          <Block v-for="item in 20" :key="item" :type="true"></Block>
        </div>
      </div>
    </div>
    <div class="singer">
      <div class="music_from">
        <i>歌手</i>
        <div class="music_from_right">
        <span class="rolling-left rolling" @click="rollingLeft_two">
          <svg t="1715699713789" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="10561" width="15" height="15"><path
            d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"
            fill="#000000" p-id="10562"></path></svg>
        </span>
          <span class="rolling-right rolling" @click="rollingRight_two">
          <svg t="1715699713789" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="10561" width="15" height="15"><path
            d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"
            fill="#000000" p-id="10562"></path></svg>
        </span>
        </div>
      </div>
      <div class="music_form_item">
        <div class="item">
          <Block v-for="item in 20" :key="item" :type="false"></Block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Block from '@/components/block.vue'
export default {
  name: 'homeIndex',
  components: {
    Block
  },
  data () {
    return {
      num: 0,
      numTwo: 0
    }
  },
  methods: {
    rollingLeft () {
      if (this.num <= 0) return
      this.num -= 16.5
      const element = document.querySelector('.song_sheet .music_form_item .item')
      element.style.translate = '-' + this.num + '%'
    },
    rollingRight () {
      if (this.num >= 66) return
      this.num += 16.5
      const listEl = document.querySelector('.song_sheet .music_form_item .item')
      listEl.style.translate = '-' + this.num + '%'
    },
    rollingLeft_two () {
      if (this.numTwo <= 0) return
      this.numTwo -= 16.5
      const element = document.querySelector('.singer .music_form_item .item')
      element.style.translate = '-' + this.numTwo + '%'
    },
    rollingRight_two () {
      if (this.numTwo >= 66) return
      this.numTwo += 16.5
      const listEl = document.querySelector('.singer .music_form_item .item')
      listEl.style.translate = '-' + this.numTwo + '%'
    }
  }
}
</script>

<style scoped lang="less">
.home {
  margin-top: 20px;
  height: 100%;
  > div{
    margin-bottom: 40px;
  }
  .song_sheet{
    margin-bottom: 40px;
  }
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
    }
  }
}

/*@keyframes scrollAnimation {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-20%);
  }
}*/
</style>
