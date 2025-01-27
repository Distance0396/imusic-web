<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Lyric from '@/components/player/Lyric.vue'
import screenfull from 'screenfull'
export default {
  name: 'playerItem',
  components: {
    Lyric
  },
  data () {
    return {
      // 控制播放器显示
      isShow: false,
      maxValue: 0,
      // 控制播放队列显示
      isDrawer: false,
      dialogVisible: false,
      iFullScreen: false
    }
  },
  methods: {
    ...mapMutations('player', ['setTotalTime', 'setFirstTime', 'setStatus', 'setIsPlay', 'setCurrentSong']),
    ...mapMutations('playlist', ['nextSong', 'lastSong', 'setPlayList']),
    ...mapActions('player', ['getLyricAndAudio']),
    // 播放暂停
    play () {
      this.setIsPlay(!this.isPlay)
      if (this.isPlay) {
        this.setStatus(true)
        this.$refs.audio.play()
      } else {
        this.setStatus(false)
        this.$refs.audio.pause()
      }
    },
    // 播放时
    current (e) {
      const curr = e.target.currentTime
      this.setFirstTime(curr)
      this.sliderValue = (this.firstTime / this.totalTime) * 100
      // this.firstTime = e.target.currentTime
      // this.sliderValue = (this.firstTime / this.endTime) * 100
    },
    // 时间转换
    formatTime (seconds) {
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    },
    // 进度条
    dragChange (value) {
      const audio = this.$refs.audio
      audio.currentTime = (value / 100) * this.totalTime
    },
    // 加载完成
    loadMetadata (e) {
      const duration = e.target.duration
      this.setTotalTime(duration)
    },
    // 是否循环
    isLoop (e) {
      this.$refs.audio.loop = !this.$refs.audio.loop
      if (this.$refs.audio.loop) {
        e.target.style.color = '#409EFF'
      } else e.target.style.color = 'currentcolor'
    },
    // 改变音量
    volumeChange (value) {
      this.$refs.audio.volume = value * 0.01
    },
    // 播放完
    overPlay () {
      this.sliderValue = 0
      this.nextSong()
    },
    // 全屏
    toggleFullScreen () {
      this.dialogVisible = true
      // 判断当前浏览器是否支持全屏
      if (screenfull.isEnabled) {
        // 当前页面是否全屏
        if (!screenfull.isFullscreen) {
          this.iFullScreen = !this.iFullScreen
          screenfull.request()
        } else {
          this.iFullScreen = !this.iFullScreen
          screenfull.exit()
        }
      } else {
        // 提醒 无法全屏浏览
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
      }
    },
    // dialog关闭前
    dialogClose () { screenfull.exit() }
  },
  computed: {
    ...mapState('playlist', ['playlist']),
    ...mapState('player', ['totalTime', 'firstTime', 'isPlay', 'status', 'lyric', 'audio']),
    ...mapGetters('playlist', ['firstPlayList']),
    sliderValue: {
      get () {
        return this.$store.state.player.sliderValue
      },
      set (newVal) {
        this.$store.commit('player/setSliderValue', newVal)
      }
    },
    volume: {
      get () {
        return this.$store.state.player.volume
      },
      set (newVal) {
        this.$store.commit('player/setVolume', newVal)
      }
    }
  },
  watch: {
    playlist: {
      // 音乐队列改变触发
      handler (newVal) {
        // console.log('音乐队列改变触发')
        this.isShow = true
        this.setIsPlay(true)
        this.setStatus(true)
        this.getLyricAndAudio(this.firstPlayList.id).then(res => {
          this.setCurrentSong(this.firstPlayList)
          this.$refs.audio.play()
        })
      }
    },
    status: {
      // musicItem点击播放暂停修改player播放暂停状态
      handler (newVal) {
        if (newVal) {
          // this.isPlay = true
          this.$refs.audio.play()
        } else {
          // this.isPlay = false
          this.$refs.audio.pause()
        }
      }
    }
  }
}
</script>
<template>
  <div class="player" v-if="isShow">
    <div class="player-left">
      <el-image @click="toggleFullScreen" class="image" :src="firstPlayList?.image"></el-image>
      <div class="player-left-info">
        <i>{{firstPlayList?.name}}</i>
        <i @click="$router.push(`/detail/singer/${firstPlayList?.singerId}`)">{{firstPlayList?.singerName}}</i>
      </div>
    </div>
    <div class="play-controller">
      <div class="contr-top">
        <audio
          ref="audio"
          :src="this.audio"
          @ended="overPlay"
          @loadedmetadata="loadMetadata"
          @timeupdate="current"
          style="width: 100%"
        />
        <div class="contr-top-left direction">
          <button class="btn">
            <i class="iconfont icon-suijibofang"></i>
          </button>
          <button class="next btn" @click="this.lastSong">
            <i class="iconfont icon-Asong"></i>
          </button>
        </div>
        <button class="contr-play" @click="play">
          <i v-show="isPlay" class="iconfont icon-zanting1" />
          <i v-show="!isPlay" class="iconfont icon-icon_play" />
<!--          <svg v-if="isPlay" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M426.666667 138.666667v746.666666a53.393333 53.393333 0 0 1-53.333334 53.333334H266.666667a53.393333 53.393333 0 0 1-53.333334-53.333334V138.666667a53.393333 53.393333 0 0 1 53.333334-53.333334h106.666666a53.393333 53.393333 0 0 1 53.333334 53.333334z m330.666666-53.333334H650.666667a53.393333 53.393333 0 0 0-53.333334 53.333334v746.666666a53.393333 53.393333 0 0 0 53.333334 53.333334h106.666666a53.393333 53.393333 0 0 0 53.333334-53.333334V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334z" fill="#000000"></path></svg>-->
<!--          <svg v-if="!isPlay" style="margin-left: 3px" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="#000000" ></path></svg>-->
        </button>
        <div class="contr-top-right direction">
          <button class="next btn" @click="this.nextSong">
            <i class="iconfont icon-xiayishou"></i>
          </button>
          <button class="btn" @click="isLoop">
            <i class="iconfont icon-danquxunhuan"></i>
          </button>
        </div>
      </div>
      <div class="contr-bottom">
        <div class="play-first" style="color: #b3b3b3;">{{this.formatTime(this.firstTime) || '00:00'}}</div>
        <el-slider
          class="progress-bar"
          v-model="sliderValue"
          :show-tooltip="false"
          @change="dragChange"
        />
        <div class="play-end" style="color: #b3b3b3;">{{ this.formatTime(this.totalTime) || '00:00'}}</div>
      </div>
    </div>
    <div class="player-right">
      <button>
        <i class="iconfont icon-changge1"></i>
      </button>
      <button @click="$store.state.common.isShowRightBox = !$store.state.common.isShowRightBox">
        <i class="iconfont icon-duilieguanli"></i>
      </button>
      <button class="volume" >
        <i class="iconfont icon-yinliang-F"></i>
        <i v-show="false" class="iconfont icon-jingyin-F"></i>
        <el-slider
          class="volume-change"
          v-model="volume"
          :show-tooltip="false"
          @input="volumeChange"
        />
      </button>
      <button @click="toggleFullScreen" style="margin: 0 20px 0 25px">
        <i class="iconfont icon-24gl-expand2"></i>
      </button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="true"
      :modal="true"
      :append-to-body="true"
      @close="dialogClose"
    >
      <Lyric :music="firstPlayList"
             :lyrics="this.lyric"
             :isPlay="isPlay"
             @play="play"
             @drag="e => dragChange(e)"
             @next="this.nextSong"
             @last="this.lastSong"
      />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/mixin";
.iconfont{
  font-size: 20px;
  &:hover{
    color: #ffffff;
  }
}
.player{
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 1000;
  background-color: rgba(21, 27, 35, 0.5);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  padding: 10px 20px 10px 20px;

  border-top-color: var(--border-color);
  border-width: 0.0625rem 0 0 0;
  border-style: solid;
  @include respond-to('phone'){
    padding: 10px 5px 10px 10px;
  }
  @include respond-to('tv'){
  }
  .player-left{
    width: 400px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    @include respond-to('phone'){
      display: none;
    }
    @include respond-to('tv'){
      width: 400px;
    }
    .image{
      border-radius: 5px;
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .player-left-info{
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      flex-direction: column;
      i{
        color: #FFFFFF;
        font-size: 16px;
      }
      i:nth-child(2){
        font-size: 13px;
        //color: #EBEEF5;
      }
    }
  }
  .play-controller{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 500px;
    @include respond-to('phone'){
    }
    @include respond-to('tv'){
      width: 500px;
    }
    .contr-top{
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      .contr-play{
        //display: flex;
        //justify-content: center;
        //align-items: center;
        //width: 35px;
        //height: 35px;
        //border-radius: 50%;
        //background-color: #FFFFFF;
        background-color: transparent;
        i{
          font-size: 36px;
        }
      }
      .next{
        margin: 0 30px 0 30px;
      }
      .direction{
        .btn{
          background-color: transparent;
        }
        .icon{
          fill: currentcolor;
        }
      }
    }
    .contr-bottom{
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      @include respond-to('phone'){
        display: none;
        //.el-slider{
        //  margin: 0 8px;
        //}
      }
      @include respond-to('tv'){
      }
      .progress-bar{
        width: 350px;
        height: 20px;
        display: flex;
        align-items: center;
      }
    }
  }
  .player-right{
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    @include respond-to('phone'){
      display: none;
    }
    @include respond-to('tv'){
      width: 400px;
    }
    button{
      background-color: transparent;
      .iconfont{
        fill: currentcolor;
        margin-left: 15px;
      }
      .dr{
        z-index: 1;
      }
    }
    .volume{
      display: flex;
      align-items: center;
      background-color: transparent;
      .icon{
        fill: currentcolor;
        margin-left: 20px;
      }
      .volume-change{
        margin-left: 20px;
        width: 100px;
      }
    }
  }
}
.el-dialog__wrapper{
  ::v-deep .el-dialog{
    background-color: var(--main-background-color);
    .el-dialog__header{
      padding: 0;
      .el-dialog__headerbtn{
        z-index: 1000;
      }
    }
    .el-dialog__body{
      padding: 0;
    }
  }
}

</style>
