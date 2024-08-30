<script>
import { getLyric } from '@/api/music'

export default {
  name: 'LyricView',
  created () {
    this.getLyric()
  },
  props: ['id', 'firstTime'],
  watch: {
    firstTime (newVal) {
      this.updateLyricIndex(newVal)
    }
  },
  data () {
    return {
      lyric: '',
      currentLyric: [],
      lyricIndex: 0,
      scrollOffset: 0,
      musicInfo: {}
    }
  },
  methods: {
    async getLyric () {
      await getLyric(this.id).then(res => {
        this.musicInfo = res.data
        this.initialize(this.musicInfo.lyric)
      })
    },
    initialize (lyric) {
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
    }
  },
  computed: {
  }
}
</script>

<template>
  <div class="homepage">
    <div class="info">
      <el-image :src="musicInfo.image" style="border-radius:8px; max-height: 350px; max-width: 350px;"></el-image>
      <div class="title">
        <i style="font-size: 24px">{{musicInfo.name}}</i>
        <i style="font-size: 18px; color: #C0C4CC">{{musicInfo.singerName}}</i>
      </div>
    </div>
    <div class="box" ref="lyricContainer">
      <ul class="lyric" ref="lyric" :style="{ transform: `translateY(-${scrollOffset}px)` }">
        <li :class="{each:true, choose: (index === lyricIndex)}" v-for="(item, index) in currentLyric" :key="index">
          {{ item.til }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.homepage{
  display: flex;
  align-items: center;
  justify-content: center;
  .info{
    display: flex;
    flex-direction: column;
    margin-left: 10vh;
    .title {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
    }
  }
  .box{
    //position: relative;
    height: 400px; /* 容器高度 */
    overflow: hidden;
    display: flex;
    margin-left: auto;
    justify-content: center;
    white-space:nowrap;
    .lyric {
      transition: transform 0.3s ease-out; /* 平滑过渡效果 */
      .each {
        width: 600px;
        font-size: 25px;
        cursor: pointer;
        text-align: right;
        padding: 15px;
        //&:hover{
        //  border-radius: 5px;
        //  background-color: #d0d0d0;
        //}
      }

      .choose {
        color: #409EFF;
        margin: 5px 20px;
        font-size: 40px;
        border-radius: 5px;
        //background-color: #d0d0d0;
        //transition: all .3s ease-out;
      }
    }
  }
}
</style>
