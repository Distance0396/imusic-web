<template>
  <div class="home">
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
  </div>
</template>

<script>
import Block from '@/components/bolck/BlockItem.vue'
import loop from '@/components/bolck/LoopItem.vue'
import scrollBar from '@/components/layout/ScrollBar.vue'
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
    // 随机获取歌手
    async getRandomSinger () {
      const { data } = await getRandomSinger()
      this.singer = data
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
