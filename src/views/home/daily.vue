<script>
import { getDailyRecommend } from '@/api/recommend'
import RecommCard from './components/RecommCard.vue'
export default {
  name: 'dailyCharts',
  components: {
    RecommCard,
  },
  mounted() {
    this.get()
  },
  data() {
    return {
      music: null,
    }
  },
  methods: {
    async get() {
      const { data } = await getDailyRecommend(3)
      this.music = data.musicImageVoList
    },
  },
}
</script>

<template>
  <div class="dailyCharts">
    <div class="main">
      <div class="title" style="font-size: 40px; color: var(--text-color)">
        每日推荐
      </div>
      <div class="container" style="display: flex; flex-wrap: wrap">
        <RecommCard
          class="recommBlock"
          v-for="item in music"
          :key="item.id"
          :obj="item"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/index';
.dailyCharts {
  .main {
    width: 100%;
    padding: 40px 20px 0 20px;
    min-height: calc(100vh - $footer);
    .title {
      font-size: 40px;
      margin-bottom: 60px;
      color: var(--text-color);
    }

    .container {
      display: flex;
      flex-wrap: wrap; /* 子项换行 */
      gap: 20px; /* 设置子项之间的间距 */
      justify-content: space-between; /* 子项均匀分布 */
      transition: all 0.1s linear;
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .recommBlock {
      width: calc(50% - 20px); /* 屏幕宽度小于768px时变为两列 */
    }
  }

  @media (max-width: 480px) {
    .recommBlock {
      width: 100%; /* 屏幕宽度小于480px时变为单列 */
    }
  }
}
</style>
