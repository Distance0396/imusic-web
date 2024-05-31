<template>
  <div class="home">
<!--    <div class="song_sheet">-->
<!--      <div class="music_from">-->
<!--        <i>歌单</i>-->
<!--        <div class="music_from_right">-->
<!--        <span class="rolling-left rolling" @click="rollingLeft">-->
<!--          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"-->
<!--               width="15" height="15"><path-->
<!--            d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"-->
<!--            fill="#000000"></path></svg>-->
<!--        </span>-->
<!--          <span class="rolling-right rolling" @click="rollingRight">-->
<!--          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"-->
<!--               width="15" height="15"><path-->
<!--            d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"-->
<!--            fill="#000000"></path></svg>-->
<!--        </span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="music_form_item">-->
<!--        <div class="item">-->
<!--          <Block v-for="item in album" :key="item" :detail="item"></Block>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <scrollBar>
      <template #title>
        <i>专辑</i>
      </template>
      <template #body>
        <Block v-for="item in album" :key="item.id" :detail="item"></Block>
      </template>
    </scrollBar>
      <scrollBar>
        <template #title>
          <i>歌手</i>
        </template>
        <template #body>
          <loop v-for="item in singer" :key="item.id" :detail="item"></loop>
        </template>
      </scrollBar>
<!--    <div class="singer">-->
<!--      <div class="music_from">-->
<!--        <i>歌手</i>-->
<!--        <div class="music_from_right">-->
<!--          <span class="rolling-left rolling" @click="rollingLeft_two">-->
<!--            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"-->
<!--                  width="15" height="15"><path-->
<!--              d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"-->
<!--              fill="#000000" ></path>-->
<!--            </svg>-->
<!--          </span>-->
<!--          <span class="rolling-right rolling" @click="rollingRight_two">-->
<!--            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"-->
<!--                  width="15" height="15"><path-->
<!--              d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"-->
<!--              fill="#000000" ></path>-->
<!--            </svg>-->
<!--        </span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="music_form_item">-->
<!--        <div class="item">-->
<!--          <loop v-for="item in singer" :key="item.id" :detail="item"></loop>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import Block from '@/components/blockItem.vue'
import loop from '@/components/loopItem.vue'
import scrollBar from '@/components/scrollBar.vue'
import { getRandomSinger } from '@/api/singer'
import { getRandomAlbum } from '@/api/album'
export default {
  name: 'homeIndex',
  components: {
    Block,
    loop,
    scrollBar
  },
  data () {
    return {
      num: 0,
      numTwo: 0,
      singer: [],
      album: []
    }
  },
  methods: {
    // rollingLeft () {
    //   if (this.num <= 0) return
    //   this.num -= 16.5
    //   const element = document.querySelector('.song_sheet .music_form_item .item')
    //   element.style.translate = '-' + this.num + '%'
    // },
    // rollingRight () {
    //   if (this.num >= 66) return
    //   this.num += 16.5
    //   const listEl = document.querySelector('.song_sheet .music_form_item .item')
    //   listEl.style.translate = '-' + this.num + '%'
    // },
    // rollingLeft_two () {
    //   if (this.numTwo <= 0) return
    //   this.numTwo -= 16.5
    //   const element = document.querySelector('.singer .music_form_item .item')
    //   element.style.translate = '-' + this.numTwo + '%'
    // },
    // rollingRight_two () {
    //   if (this.numTwo >= 66) return
    //   this.numTwo += 16.5
    //   const listEl = document.querySelector('.singer .music_form_item .item')
    //   listEl.style.translate = '-' + this.numTwo + '%'
    // },
    // 随机获取歌手
    async getRandomSinger () {
      const { data } = await getRandomSinger()
      this.singer = data
      console.log(this.singer)
    },
    // 随机获取专辑
    async getRandomAlbum () {
      const { data } = await getRandomAlbum()
      this.album = data
    }
  },
  created () {
    this.getRandomSinger()
    this.getRandomAlbum()
  }
}
</script>

<style scoped lang="less">
.home {
  margin-left: 20px;
  margin-top: 20px;
  height: 100%;
  > div{
    margin-top: 60px;
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
      display: inline-flex;
      flex-wrap: nowrap;
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
    //overflow: hidden;
    contain: paint;
    .item {
      display: inline-flex;
      flex-wrap: nowrap;
      transition: translate .9s ease;
    }
  }
}
</style>
