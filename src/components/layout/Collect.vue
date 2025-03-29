<script>
import MusicFormItem from '@/components/block/CollectItem.vue'
import { mapState, mapActions, mapGetters } from 'vuex'
import { addMusicForm } from '@/api/muiscForm'

export default {
  name: 'collectItem',
  components: { MusicFormItem },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('user', ['getCollectForm']),
    // 添加歌单
    async addMusicForm () {
      if (!this.isLogin) await this.$router.replace('/login')
      else {
        // 添加歌单api
        await addMusicForm()
        // 获取用户收藏
        await this.getCollectForm()
      }
    }
  },
  computed: {
    ...mapGetters('common', ['isBerth']),
    ...mapState('user', ['userFollow']),
    ...mapState('player', ['currentCol', 'currentSong']),
    // 是否登录
    isLogin () {
      return this.$store.getters.token
    },
    isPlaying () {
      // 检查当前播放的歌曲是否是传入的歌曲
      // return this.currentCol === path && this.currentSong.id === item.id
      return (path) => this.currentCol === path
    }
  }
}
</script>

<template>
  <div class="collect">
    <div class="menu-list">
      <span class="icon">
        <i class="iconfont icon-kucunguanli" :class="{'hover' : isBerth}"></i>
<!--        <svg :width="this.isBerth ? 22 : 15" :height="isBerth ? 22 : 15" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M488.680727 124.090182a104.727273 104.727273 0 0 1 93.184 0l279.272728 139.636363A104.727273 104.727273 0 0 1 919.272727 357.469091v332.706909a104.727273 104.727273 0 0 1-58.042182 93.696l-279.272727 139.636364a104.727273 104.727273 0 0 1-93.696 0L208.896 783.825455a104.634182 104.634182 0 0 1-57.623273-94.021819V357.469091a104.727273 104.727273 0 0 1 58.042182-93.696L342.574545 197.073455a35.048727 35.048727 0 0 1 5.352728-2.653091z m-267.636363 246.597818v319.348364a34.909091 34.909091 0 0 0 19.130181 31.371636l260.189091 130.094545v-341.178181l-279.272727-139.636364z m628.363636 0l-279.272727 139.636364v340.992l259.956363-129.954909a34.909091 34.909091 0 0 0 19.037091-26.298182l0.325818-4.887273V370.688zM360.913455 266.053818L264.378182 314.274909 535.272727 449.629091l96.442182-48.221091-270.894545-135.447273z m189.905454-79.453091a34.909091 34.909091 0 0 0-30.952727 0l-80.849455 40.401455 270.848 135.400727 96.302546-48.128z"></path></svg>-->
      </span>
      <div class="title" v-if="!isBerth">音乐库
        <button class="item-add" @click="addMusicForm" >
          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M992 480H544V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h448v448c0 17.7 14.3 32 32 32s32-14.3 32-32V544h448c17.7 0 32-14.3 32-32s-14.3-32-32-32z" fill="" ></path></svg>
        </button>
      </div>
    </div>
    <div class="collect-content">
      <div class="collect-tips"
           v-if="isLogin === ''
            || (this.userFollow.albumList === [] && this.userFollow.singerList === [] || this.userFollow.musicFormList === null)">
        <span>创建你的第一个歌单</span>
        <span>很简单，我们将祝你一臂之力</span>
        <i class="setUp" @click="addMusicForm">创建歌单</i>
      </div>
      <div v-else >
        <MusicFormItem
          :class="{active : `/album/${item.id}` === $route.path}"
          v-for="item in userFollow?.albumList"
          @click.native="$router.push(`/album/${item.id}`)"
          :album="item"
          :key="'album'+item.id"
          :isPlaying="isPlaying(`/album/${item.id}`)"
        >
        </MusicFormItem>
        <MusicFormItem
          :class="{active : `/singer/${item.id}` === $route.path}"
          v-for="item in userFollow?.singerList"
          @click.native="$router.push(`/singer/${item.id}`)"
          :singer="item"
          :key="'singer'+item.id"
          :isPlaying="isPlaying(`/singer/${item.id}`)"
        >
        </MusicFormItem>
        <MusicFormItem
          :class="{active : `/music-form/${item.id}` === $route.path}"
          v-for="item in userFollow?.musicFormList"
          @click.native="$router.push(`/music-form/${item.id}`)"
          :music-form="item"
          :key="'form'+item.id"
          :isPlaying="isPlaying(`/music-form/${item.id}`)"
        >
        </MusicFormItem>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.collect{
  text-overflow: ellipsis;
  white-space: nowrap;
  .collect-content::-webkit-scrollbar{
    display:none
  }
  :hover.collect-content::-webkit-scrollbar{
    display:block;
  }
  .menu-list{
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 10px;
    .hover{
      margin-left: 10px;
    }
    .icon{
      line-height: 40px;
      transition: all .1s ease-in-out;
      .iconfont{
        color: var(--fill-color);
        margin-right: 20px;
      }
    }
    .title{
      width: 100%;
      display: inline-flex;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
    }
    .item-add{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
      fill: var(--fill-color);
      background-color: var(--main-background-color);
      &:hover{
        background-color: var(--fill-no-active);
      }
    }
  }
  .collect-content{
    height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
    .active{
      background-color: var(--active-color);
    }
    .collect-tips{
      border-radius: 5px;
      background-color: var(--main-background-color);
      //background-color: #E4E7ED;
      margin: 20px 10px 20px 10px;
      padding: 10px 0 10px 20px;
      .setUp{
        margin-top: 10px;
        border-radius: 20px;
        display: block;
        padding: 8px 10px 8px 10px;
        width: 80px;
        background-color: var(--aside-background-color);
        //background-color: #FFFFFF;
        &:hover{
          transform: scale(1.1);
        }
      }
      span{
        display: block;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
