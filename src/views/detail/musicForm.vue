<script>
import MusicItem from '@/components/MusicItem.vue'
import ActionBar from '@/components/ActionBar.vue'
import { getMusicFormById } from '@/api/muiscForm'
import ColorThief from 'colorthief'
import { getSimpleUserById } from '@/api/user'
export default {
  name: 'musicForm',
  components: {
    ActionBar,
    MusicItem
  },
  data () {
    return {
      musicForm: {},
      backgroundColor: [],
      musicList: [],
      musicFormName: ''
    }
  },
  methods: {
    async getMusicFormById () {
      await getMusicFormById(this.getMusicFormId).then(res => {
        this.musicForm = res.data
        this.musicList = res.data.musicList
        getSimpleUserById(this.musicForm.userId).then(res => {
          this.musicFormName = res.data.name
        })
      })
    },
    // 读取图片颜色
    loadImage () {
      const img = new Image()

      const colorThief = new ColorThief()
      img.setAttribute('crossOrigin', 'anonymous')
      img.src = this.musicForm.image + '?time=' + new Date().valueOf()

      setTimeout(() => {
        // const baColor = colorThief.getColor(img)
        const baColor = colorThief.getPalette(img)
        try {
          baColor.forEach(x => {
            if (Number(x[0] * 0.299 + x[1] * 0.587 + x[2] * 0.114) > 100) {
              console.log('小于100 就是深色' + Number(x[0] * 0.299 + x[1] * 0.587 + x[2] * 0.114))
              this.backgroundColor = x
              throw new Error('获取颜色')
            }
          })
        } catch (e) {
        }
      }, 500)
    },
    async getSimpleUserById () {
      await getSimpleUserById(this.musicForm.userId).then(res => {
        this.musicFormName = res.data.name
      })
    }
  },
  computed: {
    getMusicFormId () {
      return this.$route.params.id
    }
  },
  created () {
    this.getMusicFormById()
    // this.getSimpleUserById()
  }
}
</script>

<template>
  <div class="music-form">
    <div class="head">
      <div class="background-color" :style="{'background-color': 'rgb(' + backgroundColor[0] + ',' + backgroundColor[1] + ', ' +  backgroundColor[2] + ')'}"></div>
      <div class="background-color shade"></div>
      <el-image class="img" :src="musicForm.image"  @load="loadImage" alt="" />
      <div class="album-detail">
        <span>专辑</span>
        <span style="font-size: 5rem; font-weight: bold">{{musicForm.name}}</span>
        <span>{{musicFormName}}·{{musicList.length}}首歌曲</span>
      </div>
    </div>
    <div class="gradual-block" :style="{'background-color': 'rgb(' + backgroundColor[0] + ',' + backgroundColor[1] + ', ' +  backgroundColor[2] + ')'}"></div>
    <div class="album-plank">
      <ActionBar></ActionBar>
    </div>
    <div class="musicList">
      <MusicItem v-for="(item, index) in musicList" :key="item.id" :index="index+1" :music="item"></MusicItem>
    </div>
  </div>
</template>

<style scoped lang="less">
.music-form{
  position: relative;
  z-index: 1;
  overflow: hidden;
  height: 100%;
  .head{
    height: 53vh;
    min-height: 330px;
    max-height: 400px;
    width: 100%;
    padding: 0 0 20px 20px;
    display: flex;
    align-items: flex-end;
    z-index: 0;
    position: relative;
    .shade{
      z-index: 1;
      background-image: linear-gradient(transparent 0, rgba(0, 0, 0, .3) 100%);
    }
    .background-color{
      z-index: -1;
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .img{
      z-index: 10;
      width: 14rem;
      height: 14rem;
      min-width: 180px;
      min-height: 180px;
      border-radius: 5px;
      cursor: pointer;
      box-shadow: 0 4px 60px rgba(0, 0, 0, .5);
      &:hover{
        transform: scale(1.01);
        transition: transform 0.1s ease-out;
      }
    }
    .album-detail{
      margin-left: 20px;
      display: flex;
      align-content: space-between;
      flex-direction: column;
      span{
        color: #ffffff;
      }
    }
  }
  .gradual-block{
    //position: relative;
    z-index: 1;
    float: left;
    width: 100%;
    height: 530px;
    background-image: linear-gradient(rgba(0, 0, 0, .4) 0, #ffffff 100%);
  }
  .album-plank{
    display: flex;
    align-items: center;
    width: 100%;
    z-index: 10;
    height: 5rem;
    position: absolute;
  }
  .musicList{
    width: 100%;
    height: 30rem;
    padding: 0 20px 0 20px;
    position: absolute;
    margin-top: 5rem;
    //bottom: 5rem;
    z-index: 10;
  }
}
</style>
