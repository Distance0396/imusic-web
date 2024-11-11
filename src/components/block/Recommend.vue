<script>
export default {
  name: 'RecommendBlock',
  data () {
    return {
    }
  }
}
</script>

<template>
  <div class="day-block" @click="$router.push('/daily')">
    <div class="image">
      <el-image src="https://cdn.dribbble.com/userupload/17145018/file/original-178ff21f76f05278de2a523534aa569e.png?resize=400x300&vertical=center"></el-image>
    </div>
    <div class="info">
      <span class="text">每日推荐</span>
<!--      <h4>人生若只如初见，何事秋风悲画扇。</h4>-->
      <i class="iconfont icon-youjiantou2"></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
$wth: 450px;
.day-block{
  width: $wth;
  height: 250px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  display: flex;
  overflow: hidden;
  position: relative;
  background-color: var(--singer-card-bg);
  transition: all .2s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: var(--singer-card-bg-h);
  }
  &:hover .info .iconfont{
    opacity: 1;
    right: 20px;
  }
  .image{
    min-width: calc($wth / 2);
    height: 100%;
    margin-right: 30px;
    .el-image{
      width: calc($wth / 2 + 50px);
      height: 100%;
    }
  }
  .info{
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    .text{
      margin-bottom: 30px;
      font-size: 30px;
    }
    .iconfont{
      transition: all .2s ease-in;
      opacity: 0;
      font-size: 40px;
      position: absolute;
      right: 40px;
      bottom: 10px;
    }
  }
}
</style>
