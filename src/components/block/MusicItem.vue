<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  name: 'musicItem',
  props: {
    music: Object,
    index: Number,
    backup: String
  },
  methods: {
    ...mapMutations('playlist', ['appoint']),
    ...mapActions('player', ['playSong', 'playCol', 'getLyricAndAudio']),
    ...mapMutations('player', ['setStatus']),
    // 点击播放将歌曲添加至队列
    play () {
      // 将歌曲信息添加给队列
      this.appoint(this.music)
      this.playSong(this.music)
      this.playCol(this.$router.history.current.fullPath)
    },
    // 点击省略符号
    clickMore (e) {
      // e.preventDefault()
      this.$emit('click-more', { event: e, musicId: this.music?.id })
    },
    // 暂停
    pause () {
      this.setStatus(false)
    }
  },
  computed: {
    ...mapState('player', ['status', 'currentSong', 'currentCol']),
    isPlaying () { return this.currentSong?.id === this.music?.id && this.status }
  }
}
</script>

<template>
  <div class="musicItem" ref="music" @dblclick="play">
    <div class="music-index public">
      <div v-if="isPlaying" class="public ">
        <img class="index" style="width: 1rem; height: 1rem;" src="@/assets/equaliser.gif" alt="">
        <button class="player" @click.stop="pause">
          <i class="iconfont icon-zanting1 icon"></i>
        </button>
      </div>
      <div v-else class="public">
        <span class="index text" :class="{ activeName: isPlaying }">
          {{ index }}
        </span>
        <button class="player" @click.stop="play">
          <i class="iconfont icon-icon_play icon"></i>
        </button>
      </div>
    </div>
    <div class="music-info public">
      <el-image :src="music?.image || backup" :lazy="true" class="img" />
      <div style="display: flex; flex-direction: column">
        <i :class="{ activeName: isPlaying }">{{ music?.name }}</i>
        <i v-if="$route.name !== 'Singer'" class="singer" @click="$router.replace(`/singer/${music?.singerId}`)">{{ music?.singerName }}</i>
      </div>
    </div>
    <div class="music-num public" style="margin-right: auto;">
      <div class="num">
        {{ music?.count?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
      </div>
    </div>
    <div class="music-more public">
      <div class="duration">
        {{ music?.duration }}
      </div>
      <div class="more" @click.stop.prevent="clickMore">
        <i class="iconfont icon-more" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active{
  background-color: rgba(255, 255, 255, 0.4);
}
.musicItem:hover {
  background-color: rgba(167, 167, 167, 0.4);
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
.activeName{
  color: #1eb754;
}
.public {
  display: flex;
  align-items: center;
  color: var(--text-color);
}
.musicItem {
  border-radius: 5px;
  width: 100%;
  padding: 8px;
  display: grid;
  grid-template-columns: 0.5fr 650px 150px 4fr;
  max-width: 1200px;
  overflow: hidden;
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
  }
  .index {
    pointer-events: none;
    position: absolute;
  }
  //.text {
  //  color: var(--text-color);
  //}
}
.music-info {
  margin-left: 10px;
  display: flex;
  //color: var(--text-color);
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
  //color: var(--text-color);
  .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}
.music-more {
  justify-content: right;
  margin-right: 10px;
  .duration {
    //color: var(--text-color);
    margin-right: 15px;
  }
  .more {
    //color: var(--text-color);
    opacity: 0;
  }
}
</style>
