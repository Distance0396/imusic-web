<script>
import MusicFormItem from '@/components/MusicFormItem.vue'
import { mapState, mapActions } from 'vuex'
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
      await addMusicForm().then(res => {
        this.getCollectForm()
      })
    },
    log () {
      console.log('1231231ds')
    }
  },
  computed: {
    ...mapState('user', ['collectForm']),
    // 是否登录
    isLogin () {
      return this.$store.getters.token
    },
    isMusicFormList () {
      return this.$store.getters.musicFormList
    }
  },
  created () {
    if (this.isLogin) {
      this.getCollectForm()
    }
  }
}
</script>

<template>
  <div class="collect">
    <div class="menu-list">
      <span class="icon">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M488.680727 124.090182a104.727273 104.727273 0 0 1 93.184 0l279.272728 139.636363A104.727273 104.727273 0 0 1 919.272727 357.469091v332.706909a104.727273 104.727273 0 0 1-58.042182 93.696l-279.272727 139.636364a104.727273 104.727273 0 0 1-93.696 0L208.896 783.825455a104.634182 104.634182 0 0 1-57.623273-94.021819V357.469091a104.727273 104.727273 0 0 1 58.042182-93.696L342.574545 197.073455a35.048727 35.048727 0 0 1 5.352728-2.653091z m-267.636363 246.597818v319.348364a34.909091 34.909091 0 0 0 19.130181 31.371636l260.189091 130.094545v-341.178181l-279.272727-139.636364z m628.363636 0l-279.272727 139.636364v340.992l259.956363-129.954909a34.909091 34.909091 0 0 0 19.037091-26.298182l0.325818-4.887273V370.688zM360.913455 266.053818L264.378182 314.274909 535.272727 449.629091l96.442182-48.221091-270.894545-135.447273z m189.905454-79.453091a34.909091 34.909091 0 0 0-30.952727 0l-80.849455 40.401455 270.848 135.400727 96.302546-48.128z"></path></svg>
      </span>
      <div class="title">音乐库
        <button class="item-add" @click="addMusicForm">
          <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M992 480H544V32c0-17.7-14.3-32-32-32s-32 14.3-32 32v448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h448v448c0 17.7 14.3 32 32 32s32-14.3 32-32V544h448c17.7 0 32-14.3 32-32s-14.3-32-32-32z" fill="" ></path></svg>
        </button>
      </div>
    </div>
    <div class="collect-content">
      <div class="collect-tips" v-if="isLogin === ''">
        <span>创建你的第一个歌单</span>
        <span>很简单，我们将祝你一臂之力</span>
        <i class="setUp" @click="addMusicForm">创建歌单</i>
      </div>
      <div v-else >
        <MusicFormItem
          :class="{active : `/detail/album/${item.id}` === $route.path}"
          v-for="item in collectForm.albumList"
          @click.native="$router.push(`/detail/album/${item.id}`)"
          :album="item"
          :key="item"
        >
        </MusicFormItem>
        <MusicFormItem
          :class="{active : `/detail/singer/${item.id}` === $route.path}"
          v-for="item in collectForm.singerList"
          @click.native="$router.push(`/detail/singer/${item.id}`)"
          :singer="item"
          :key="item.id"
        >
        </MusicFormItem>
        <MusicFormItem
          :class="{active : `/detail/music-form/${item.id}` === $route.path}"
          v-for="item in collectForm.musicFormList"
          @click.native="$router.push(`/detail/music-form/${item.id}`)"
          :music-form="item"
          :key="item"
        >
        </MusicFormItem>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.collect{
  margin-top: 10px;
  .menu-list{
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin-bottom: 10px;
    fill: #000000;
    .icon{
      svg{
        margin-top: 4px;
        margin-right: 15px;
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
      &:hover{
        background-color: #e9e9e9;
      }
    }
  }
  .collect-content::-webkit-scrollbar{
     //width: 10px;
     display:none
   }
  .collect-content{

    height: 300px;
    overflow-y: scroll;
    .active{
      background-color: #E4E7ED;
      //transition: background-color .2s linear;
    }
    .collect-tips{
      border-radius: 5px;
      background-color: #E4E7ED;
      margin: 20px 10px 20px 10px;
      padding: 10px 0 10px 20px;
      .setUp{
        margin-top: 10px;
        border-radius: 20px;
        display: block;
        padding: 8px 10px 8px 10px;
        width: 80px;
        background-color: #FFFFFF;
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
