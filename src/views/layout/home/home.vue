<template>
  <div class="home" v-title data-title="主页">
    <scrollBar>
      <template #title>
        <i>专辑</i>
      </template>
      <template #body>
        <Block v-for="item in album" :key="item.id">
          <template #img>
            <el-image :src="item.image"
              style="width: 100%;
              height: 100%;
              cursor: pointer;
              border-radius: 5px;
              object-fit: cover;"
              fit="cover"
              lazy="lazy"
              alt=""
              @click="$router.push(`/detail/album/${item.id}`)"
            />
          </template>
          <template #nameOne>
            <i @click="$router.push(`/detail/album/${item.id}`)">{{item.name}}</i>
          </template>
          <template #nameTwo>
            <i @click="$router.push(`/detail/singer/${item.singerId}`)">{{item.singerName}}</i>
          </template>
        </Block>
      </template>
    </scrollBar>
    <scrollBar>
      <template #title>
        <i>歌手</i>
      </template>
      <template #body>
        <Block v-for="item in singer" :key="item.id">
          <template #img>
            <el-image
               :src="item.avatar || item.image"
               style="width: 100%;
               height: 100%;
               cursor: pointer;
               border-radius: 50%;
               object-fit: cover;"
               fit="cover"
               :lazy="true"
               alt=""
               @click="$router.push(`/detail/singer/${item.id}`)"
            ></el-image>
          </template>
          <template #nameOne>
            <i @click="$router.push(`/detail/singer/${item.id}`)">{{item.name}}</i>
          </template>
          <template #nameTwo>
            艺人
          </template>
        </Block>
      </template>
    </scrollBar>
  </div>
</template>

<script>
import Block from '@/components/bolck/Block.vue'
import scrollBar from '@/components/layout/ScrollBar.vue'
// import Footer from '@/components/layout/footer.vue'
// import { getRandomSinger } from '@/api/singer'
// import { getRandomAlbum } from '@/api/album'
import { mapState } from 'vuex'

export default {
  name: 'homeIndex',
  components: {
    Block,
    // Footer,
    scrollBar
  },
  data () {
    return {
      num: 0,
      numTwo: 0
    }
  },
  methods: {
  },
  created () {
    // if (!this.isLogin) {
    // this.query()
    // }
  },
  computed: {
    ...mapState('common', ['singer', 'album']),
    isLogin () {
      return this.$store.getters.token
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  margin-left: 20px;
  margin-top: 20px;
  //height: 100%;
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
      display: flex;
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
