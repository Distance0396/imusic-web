<script>
import { mapMutations } from 'vuex'

export default {
  name: 'musicItem',
  mounted () {
    this.$refs.music.addEventListener('contextmenu', this.ContextMenu)
  },
  beforeDestroy () {
    this.$refs.music.removeEventListener('contextmenu', this.ContextMenu)
  },
  props: {
    music: Object,
    index: Number
    // avatar: String
  },
  methods: {
    ...mapMutations('playlist', ['unshiftPlayList', 'appoint']),
    ContextMenu () {
      this.$emit('select', this.music)
    },
    formatTime (seconds) {
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    },
    // 音频初始话执行后执行
    ready () {
      this.duration = this.formatTime(this.$refs.audio.duration)
    },
    play () {
      this.appoint(this.music)
    }
  },
  computed: {
  },
  watch: {
    music (newVal, oldVal) {
      console.log('123')
      console.log(newVal)
      console.log(oldVal)
    }
  },
  data () {
    return {
      audio: require('@/style/audio/宇多田ヒカル椎名林檎-二時間だけのバカンス (只有两小时的假期).mp3'),
      duration: ''
    }
  }
}
</script>

<template>
  <div class="musicItem" ref="music">
    <div class="music-index public">
      <div class="public">
        <span class="index">
          {{index}}
        </span>
        <button class="player" @click="play">
          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z"></path></svg>
        </button>
      </div>
    </div>
    <div class="music-info public" v-if="music.image">
      <el-image :src="music.image" alt="" style="" class="img" ></el-image>
      <div style="display: flex; flex-direction: column">
        <i>{{music.name}}</i>
        <i v-if="$route.name !== 'Singer'" class="singer" @click="$router.replace(`/detail/singer/${music.singerId}`)">{{music.singerName}}</i>
      </div>
    </div>
    <div class="music-info" v-else style="display: flex; flex-direction: column;">
      <i>{{music.name}}</i>
      <i class="singer" @click="$router.replace(`/detail/singer/${music.singerId}`)">{{music.singerName}}</i>
    </div>
    <div class="music-num public">
      <div class="num">
        {{music.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}
      </div>
    </div>
    <div class="music-more public">
      <div class="duration">
        {{duration}}
        <audio ref="audio" :src="audio" @canplay="ready"></audio>
      </div>
      <div class="more">
        <span>
          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M96 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z"></path><path d="M512 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z" ></path><path d="M928 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z" ></path></svg>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@media (hover: hover) {
  .musicItem:hover {
    background-color: rgba(212, 212, 212, 0.4);
    border-radius: 5px;
    transition: background-color .2s;
    opacity: 1;
  }
  .musicItem:hover .music-index .public .player{
    opacity: 1;
  }
  .musicItem:hover .music-index .public .index{
    opacity: 0;
  }
  .musicItem:hover .music-more .more{
    opacity: 1;
    transition: opacity .2s;
  }
}

.musicItem{
  width: 100%;
  padding: 8px;
  display: grid;
  //grid-template-columns: 3rem 36rem 8rem 22rem;
  grid-template-columns: 0.5fr 5fr 4fr 4fr;
  //grid-template-columns: 0.5fr 5fr 100px 100px;
  .public{
    display: flex;
    align-items: center;
  }
  .music-index{
    padding: 0 15px;
    .player{
      background-color: #FFFFFF00;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      opacity: 0;
    }
    .index{
      pointer-events: none;
      position: absolute;
    }
  }
  .music-info{
    margin-left: 10px;
    display: flex;
    .img{
      width: 40px; height: 40px;
      border-radius: 5px;
      margin-right: 10px;
    }
    .singer{
      width: 0;
      font-size: 13px;
      &:hover{
        text-decoration: underline;
        transition: text-decoration .5s linear;
      }
    }
  }
  .music-num{
    text-align: right;
    justify-self: end;
    .num{
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  }
  .music-more{
    justify-content: right;
    margin-right: 10px;
    .duration{
      margin-right: 10px;
    }
    .more{
      opacity: 0;
    }
  }
}
</style>
