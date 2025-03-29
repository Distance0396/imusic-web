<script>
export default {
  name: 'RecommendBlock',
  data() {
    return {}
  },
}
</script>

<template>
  <div class="daily">
    <div
      class="daily__bg-image"
      :style="{
        backgroundImage: `linear-gradient(var(--gradation-color) 0, rgba(0, 0, 0, 0.4) 0),
       url('https://distance0.oss-cn-chengdu.aliyuncs.com/music/9212c55c-4f45-46ed-a31d-8eb175576106.jpg')`,
      }"
    ></div>
    <div class="daily__info">
      <div class="info-top-tips">
        <span>April 2025</span>
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/ios-glyphs/30/filled-like.png"
          alt="filled-like"
        />
        <!-- <i class="iconfont ">
          November 2025
        </i> -->
      </div>
      <div class="info-detail">
        <div class="title">个性推荐</div>
        <div class="music-info">
          <span class="name">这世界那么多人 ·</span>
          <span class="singer">莫文蔚</span>
        </div>
      </div>
      <!-- <div class="info-play-button">view Trip</div> -->
      <div class="info-play">
        <i class="iconfont icon-icon_play"></i>
      </div>
      <!-- <i class="iconfont icon-youjiantou2"></i> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/mixin';
$wth: 450px;
$wth-phone: 260px;
.daily {
  display: flex;
  position: relative;
  width: $wth;
  height: 250px;
  min-width: 260px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: var(--singer-card-bg);
  cursor: pointer;

  &:hover {
    background-color: var(--singer-card-bg-h);
  }
  @include respond-to('phone') {
    width: $wth-phone;
  }
  @include respond-to('tv') {
    // width: $wth-phone;
  }
  &__bg-image {
    position: absolute;
    height: 100%;
    width: 100%;
    // z-index: 10;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
    color: white;

    .info-top-tips {
      display: flex;
      justify-content: space-between;
      height: 30px;
      line-height: 30px;
      width: 100%;
      span {
        font-size: 18px;
        font-weight: 600;
      }
    }
    .info-detail {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      // margin-top: 2rem;
      .title {
        margin-bottom: 10px;
        font-size: 40px;
        font-weight: 600;
      }
      .music-info {
        .name {
          font-size: 18px;
          font-weight: 600;
        }
        .singer {
          font-size: 18px;
          font-weight: 600;
        }
      }
    }

    .info-play-button {
      padding: 10px;
      border-radius: 8px;
      color: white;
      background-color: rgb(136, 141, 150);
      text-align: center;
      opacity: 0.4;
    }
    .info-play {
      width: 45px;
      margin-top: auto;
      text-align: center;
      color: white;
      transition: transform 0.1s ease-out;
      &:hover {
        color: rgb(240, 240, 240);
        transform: scale(1.2);
      }
    }
    .iconfont {
      transition: all 0.1s ease-in;
      // opacity: 0;
      font-size: 30px;
      // position: absolute;
      // right: 40px;
      // bottom: 10px;
    }
  }
}
</style>
