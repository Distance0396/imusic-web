<template>
  <div class="home" v-title data-title="主页">
    <div class="channel">
      <Recommend @click="$router.push('/daily')" />
      <div
        class="Leaderboard"
        style="
          width: 400px;
          height: 250px;
          background-color: #1b2735;
          border-radius: 8px;
        "
      >
        <div class="title">排行榜</div>
        <div class="content">
          <span>10:30的飞机场</span>
          <span>10:30的飞机场</span>
          <span>10:30的飞机场</span>
          <span>10:30的飞机场</span>
        </div>
      </div>
    </div>
    <scrollBar>
      <template #title>
        <i>专辑</i>
      </template>
      <template #body>
        <Block v-for="item in album" :key="item.id">
          <template #img>
            <el-image
              :src="item.image"
              style="
                width: 100%;
                height: 100%;
                cursor: pointer;
                border-radius: 5px;
                object-fit: cover;
              "
              fit="cover"
              lazy="lazy"
              alt=""
              @click="$router.push(`/album/${item.id}`)"
            />
          </template>
          <template #nameOne>
            <i @click="$router.push(`/album/${item.id}`)">{{ item.name }}</i>
          </template>
          <template #nameTwo>
            <i @click="$router.push(`/singer/${item.singerId}`)">
              {{ item.singerName }}
            </i>
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
            <!--            <img v-lazy="item?.avatar || item?.image" :key="item?.avatar || item?.image"-->
            <!--               style="width: 100%;-->
            <!--               height: 100%;-->
            <!--               cursor: pointer;-->
            <!--               border-radius: 50%;-->
            <!--               object-fit: cover;">-->
            <el-image
              :src="item?.avatar || item?.image"
              style="
                width: 100%;
                height: 100%;
                cursor: pointer;
                border-radius: 50%;
                object-fit: cover;
              "
              fit="cover"
              :lazy="true"
              alt=""
              @click="$router.push(`/singer/${item.id}`)"
            />
          </template>
          <template #nameOne>
            <i @click="$router.push(`/singer/${item.id}`)">{{ item.name }}</i>
          </template>
          <template #nameTwo>艺人</template>
        </Block>
      </template>
    </scrollBar>
  </div>
</template>

<script>
import Block from '@/components/block/Block.vue'
import scrollBar from '@/components/layout/ScrollBar.vue'
import Recommend from './components/Recommend.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'homeIndex',
  components: {
    Block,
    scrollBar,
    Recommend,
  },
  data() {
    return {
      num: 0,
      numTwo: 0,
    }
  },
  methods: {
    ...mapActions('common', ['query']),
  },
  mounted() {
    this.query()
  },
  computed: {
    ...mapState('common', ['singer', 'album']),
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/scss/index';
.home {
  padding: 20px 0 60px 20px;
  min-height: calc(100vh - $footer);
  color: var(--text-color);
  > div {
    margin-top: 60px;
  }
  .channel {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    > div {
      margin-right: 3vw;
    }
    .Leaderboard {
      position: relative;
      padding: 15px;
      .title {
        font-size: 30px;
        position: absolute;
        right: 20px;
      }
      .content {
        position: absolute;
        display: flex;
        flex-direction: column;
        font-size: 20px;
      }
    }
  }
}
</style>
