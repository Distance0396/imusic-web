<script>
import { mapState } from 'vuex'

export default {
  name: 'LyricView',
  mounted () {
    this.initialize(this.lyrics)
  },
  props: ['music', 'lyrics', 'isPlay'],
  watch: {
    lyrics (newVal) {
      this.lyricIndex = 0
      this.scrollOffset = 0
      this.currentLyric = []
      this.initialize(newVal)
    },
    firstTime (newVal) {
      this.updateLyricIndex(newVal)
    }
  },
  data () {
    return {
      currentLyric: [],
      lyricIndex: 0,
      scrollOffset: 0
    }
  },
  methods: {
    initialize (lyric) {
      if (lyric == null) return
      // 去掉歌词字符串中的所有 \r\n
      const cleanedLyric = lyric.replace(/\r\n/g, '\n')
      // 将清理后的歌词字符串按照 '[' 分割成数组，然后去掉第一个空元素
      const lyArr = cleanedLyric.split('[').slice(1)
      // 定义一个空数组，用于存储处理后的歌词
      const lrcArray = []

      // 遍历处理每一条歌词
      lyArr.forEach(item => {
        // 将每一条歌词再次按 ']' 分割成数组
        const arr = item.split(']')
        // 时间换算成秒，将分钟部分（m）乘以60并加上秒部分（s）得到总秒数
        const m = parseInt(arr[0].split(':')[0])
        const s = parseInt(arr[0].split(':')[1])
        const timeInSeconds = m * 60 + s

        // 如果歌词内容存在且不是换行符，则将时间和歌词内容作为对象存入 lrcArray 数组中
        if (arr[1] && arr[1].trim()) {
          lrcArray.push({
            time: timeInSeconds,
            til: arr[1].trim()
          })
        }
      })

      // console.log(lrcArray)
      // 存储数据，将处理后的歌词数组赋值给 currentLyric 属性
      this.currentLyric = lrcArray
    },
    updateLyricIndex (currentTime) {
      const index = this.currentLyric.findIndex((item, i) => {
        const nextItem = this.currentLyric[i + 1]
        return currentTime >= item.time && (!nextItem || currentTime < nextItem.time)
      })
      this.lyricIndex = index === -1 ? 0 : index
      this.scrollLyrics()
    },
    scrollLyrics () {
      const lineHeight = 65 // 每行歌词的高度，可以根据实际情况调整
      const offset = this.lyricIndex * lineHeight
      this.scrollOffset = offset - (this.$refs.lyricContainer.clientHeight / 2) + (lineHeight / 2)
    },
    // 进度条
    dragChange (value) {
      this.$emit('drag', value)
      if (value === 100) {
        this.initialize(this.music)
      }
    }
  },
  computed: {
    ...mapState('player', ['totalTime', 'firstTime']),
    sliderValue: {
      get () {
        return this.$store.state.player.sliderValue
      },
      set (newVal) {
        this.$store.commit('player/setSliderValue', newVal)
      }
    }
  }
}
</script>

<template>
  <div class="homepage"  >
      <div class="blur" :style="{ backgroundImage: `url(${music.image})`}"></div>
      <div class="content">
        <div class="top">
          <div class="info">
            <el-image :src="music.image" style="border-radius:8px; max-height: 350px; max-width: 350px;"></el-image>
            <div class="title">
              <i style="font-size: 24px">{{music.name}}</i>
              <i style="font-size: 18px; color: #C0C4CC">{{music.singerName}}</i>
            </div>
          </div>
          <div class="box" ref="lyricContainer">
            <ul class="lyric" ref="lyric" :style="{ transform: `translateY(-${scrollOffset}px)` }">
              <li :class="{each:true, choose: (index === lyricIndex)}"
                  v-for="(item, index) in currentLyric"
                  :key="index">
                {{ item.til }}
              </li>
              <li v-if="this.lyrics == null" style="margin-top: 200px; font-size: 60px;">
                暂时没有歌词哦
              </li>
            </ul>
          </div>
        </div>
        <div class="but">
          <div class="drag">
            <el-slider v-model="sliderValue" @change="dragChange" class="progress-bar" :show-tooltip="false"></el-slider>
          </div>
          <div class="svg-bar">
            <i @click.stop="() => $emit('last')" class="iconfont icon-next-fill rotate"></i>
            <i @click.stop="() => $emit('play')">
              <i v-show="isPlay" class="iconfont icon-zanting1"></i>
              <i v-show="!isPlay" class="iconfont icon-icon_play"></i>
            </i>
<!--            <i @click.stop="() => $emit('play')" class="iconfont icon-zanting1"></i>-->
            <i @click.stop="() => $emit('next')" class="iconfont icon-next-fill"></i>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped lang="scss">
.homepage{
  color: var(--text-color);
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  .blur{
    position: absolute;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    filter: blur(40px) brightness(1);
    transform: scale(1.2);
    animation: moveBackground 30s infinite alternate;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.8;
      background-color: var(--lyric-bg);
      z-index: 2;
    }
    @keyframes moveBackground {
      0% {
        transform: scale(1.1) translate(0, 0) rotate(0deg) skew(0deg, 0deg); /* 初始无旋转和扭曲 */
        opacity: 0.3;
        filter: blur(45px) brightness(1);
      }
      25% {
        transform: scale(1.15) translate(100px, -100px) rotate(10deg) skew(10deg, 5deg); /* 扭曲和旋转幅度增加 */
        opacity: 0.4;
        filter: blur(43px) brightness(1.2);
      }
      50% {
        transform: scale(1.2) translate(200px, 0) rotate(-15deg) skew(-15deg, -10deg); /* 更大角度的扭曲和旋转 */
        opacity: 0.5;
        filter: blur(54px) brightness(1.4);
      }
      75% {
        transform: scale(1.25) translate(100px, 100px) rotate(8deg) skew(8deg, -8deg); /* 保持较大的扭曲效果 */
        opacity: 0.4;
        filter: blur(45px) brightness(1.2);
      }
      100% {
        transform: scale(1.3) translate(0, 200px) rotate(0deg) skew(0deg, 0deg); /* 恢复无旋转和扭曲 */
        opacity: 0.3;
        filter: blur(46px) brightness(1);
      }
    }
  }
  .content{
    position: relative;
    z-index: 500;
    padding: 10vh 10vw 0 10vw;
    .top{
      display: flex;
      align-items: center;
      justify-content: center;
      .info{
        display: flex;
        flex-direction: column;
        .title {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
        }
      }
      .box {
        height: 600px; /* 容器高度 */
        overflow: hidden;
        display: flex;
        margin-left: auto;
        justify-content: center;
        white-space: nowrap;
        .lyric {
          transition: transform 0.3s ease-out; /* 平滑过渡效果 */
          .each {
            width: 600px;
            font-size: 25px;
            cursor: pointer;
            text-align: right;
            padding: 15px;
          }
          .choose {
            color: #409EFF;
            margin: 5px 20px;
            font-size: 40px;
            border-radius: 5px;
          }
        }
      }
    }
    .but{
      margin-top: 150px;
      .drag{
        .el-slider{
          ::v-deep .el-slider__runway{
            .el-slider__button-wrapper{
              .el-slider__button{
                display: none;
              }
            }
          }
          &:hover ::v-deep .el-slider__runway .el-slider__button-wrapper .el-slider__button{
            display: inline-block;
          }
        }
      }
      .progress-bar{
        width: 100%;
        height: 20px;
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        ::v-deep .el-slider__runway{
          .el-slider__button-wrapper{
            .el-slider__button{
              display: none;
            }
          }
        }
      }
      .svg-bar{
        display: flex;
        justify-content: space-between;
        width: 265px;
        margin: 0 auto;
        .iconfont{
          font-size: 50px;
        }
        .rotate {
          height: 100%;
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
