<script>
import { mapMutations, mapState, mapActions } from 'vuex'

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
    index: Number,
    backup: String
  },
  methods: {
    ...mapMutations('playlist', ['appoint']),
    ...mapActions('player', ['playSong', 'playCol', 'getLyricAndAudio']),
    ...mapMutations('player', ['setStatus']),
    // 右键点击的歌曲
    ContextMenu () {
      this.$emit('select-music', this.music)
    },
    formatTime (seconds) {
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    },
    // 音频初始话执行后执行
    // ready () {
    //   this.duration = this.formatTime(this.$refs.audio.duration)
    // },
    // 点击播放将歌曲添加至队列
    play () {
      this.appoint(this.music)
      this.setStatus(true)
      // this.getLyricAndAudio(this.music.id)
      this.playSong(this.music)
      this.playCol(this.$router.history.current.fullPath)
    },
    // 点击省略符号
    clickMore (e) {
      e.preventDefault()
      e.stopPropagation()
      this.$emit('position', e)
    },
    // 暂停
    pause () {
      this.setStatus(false)
    }
  },
  computed: {
    ...mapState('player', ['status', 'currentSong', 'currentCol']),
    isPlaying () {
      return music => this.currentSong && this.currentSong.id === music.id
    }
  },
  data () {
    return {
      // duration: ''
    }
  }
}
</script>

<template>
  <div class="musicItem" ref="music">
    <div class="music-index public">
      <div v-if="isPlaying(music) && status" class="public ">
        <img class="index" style="width: 1rem; height: 1rem;" src="@/assets/equaliser.gif" alt="">
        <button class="player" @click.stop="pause">
          <i class="iconfont icon-zanting1 icon"></i>
        </button>
      </div>
      <div v-else class="public">
        <span class="index text">
          {{ index }}
        </span>
        <button class="player" @click.stop="play">
          <i class="iconfont icon-icon_play icon"></i>
          <!--          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z"></path></svg>-->
        </button>
      </div>
    </div>
    <div class="music-info public" v-if="music.image || backup">
      <el-image :src="music.image || backup" alt="" style="" class="img"></el-image>
      <div style="display: flex; flex-direction: column">
        <i>{{ music.name }}</i>
        <i v-if="$route.name !== 'Singer'" class="singer" @click="$router.replace(`/detail/singer/${music.singerId}`)">{{ music.singerName }}</i>
      </div>
    </div>
    <div class="music-info" v-else style="display: flex; flex-direction: column;">
      <i>{{ music.name }}</i>
      <i class="singer" @click="$router.replace(`/detail/singer/${music.singerId}`)">{{ music.singerName }}</i>
    </div>
    <div class="music-num public" style="margin-right: 20px;">
      <div class="num">
        {{ music.count?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
      </div>
    </div>
    <div class="music-more public">
      <div class="duration">
        {{ music.duration }}
      </div>
      <div class="more" @click="clickMore">
        <span>
          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
            <path d="M96 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z"></path>
            <path d="M512 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z"></path>
            <path d="M928 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z"></path>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@media (hover: hover) {
  .musicItem:hover {
    background-color: rgba(212, 212, 212, 0.4);
    border-radius: 5px;
    transition: background-color .2s;
    opacity: 1;
  }
  .musicItem:hover .music-index .public .player {
    opacity: 1;
  }
  .musicItem:hover .music-index .public .index {
    opacity: 0;
  }
  .musicItem:hover .music-more .more {
    opacity: 1;
    transition: opacity .2s;
  }
}
.musicItem {
  width: 100%;
  padding: 8px;
  display: grid;
  //grid-template-columns: 3rem 36rem 8rem 22rem;
  grid-template-columns: 0.5fr 700px 4fr 4fr;
  //grid-template-columns: 0.5fr 5fr 100px 100px;
  //fill: var(--fill-color);
  .public {
    display: flex;
    align-items: center;
  }
  .music-index {
    padding: 0 15px;
  }
  .player {
    background-color: #FFFFFF00;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    opacity: 0;
    color: var(--text-color);
  }
  .index {
    pointer-events: none;
    position: absolute;
  }
  .text {
    color: var(--text-color);
  }
}
.music-info {
  margin-left: 10px;
  display: flex;
  color: var(--text-color);
  .img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    margin-right: 10px;
  }
  .singer {
    width: 0;
    font-size: 13px;
    &:hover {
      text-decoration: underline;
      transition: text-decoration .5s linear;
    }
  }
}
.music-num {
  text-align: right;
  justify-self: end;
  color: var(--text-color);
  .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}
.music-more {
  justify-content: right;
  margin-right: 10px;
  .duration {
    color: var(--text-color);
    margin-right: 10px;
  }
  .more {
    color: var(--text-color);
    opacity: 0;
  }
}
</style>
