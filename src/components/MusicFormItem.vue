<script>
import { getSimpleUserById } from '@/api/user'

export default {
  name: 'MusicFormItem',
  props: {
    musicForm: {
      type: Object
    }
  },
  data () {
    return {
      loading: true,
      musicFormName: ''
    }
  },
  methods: {
    changeLoad () {
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    skip () {
      this.$router.push(`/detail/music-form/${this.musicForm.id}`)
    }
  },
  async created () {
    await getSimpleUserById(this.musicForm.userId).then(res => {
      this.musicFormName = res.data.name
    })
  },
  mounted () {
    this.changeLoad()
  }
}
</script>

<template>
  <el-skeleton :loading="loading" animated class="musicForm" @click.native="skip">
    <template slot="template">
      <div class="musicForm-loading">
        <el-skeleton-item
          class="image"
          variant="image"
          style="width: 50px; height: 50px;"
        />
        <div class="musicForm-info">
          <el-skeleton-item variant="h3" style="width: 50%; margin-bottom: 5px" />
          <el-skeleton-item variant="h3" style="width: 100%;" />
        </div>
        <div></div>
      </div>
    </template>
    <template>
      <el-image class="image" :src="musicForm.image">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div class="musicForm-info" style="display: flex; flex-direction: column; margin-left: 10px">
        <span>{{musicForm.name}}</span>
        <span>歌单·{{musicFormName}}</span>
      </div>
      <div></div>
    </template>
  </el-skeleton>
</template>

<style scoped lang="less">
.musicForm{
  width: 100%;
  padding: 6px 6px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 2px;
  &:hover{
    background-color: #E4E7ED;
    transition: background-color .2s linear;
  }
  .musicForm-loading{
    display: flex;
    align-items: center;
  }
  .image{
    border-radius: 5px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .musicForm-info{
    width: 100px;
    margin-left: 10px;
    display: inline-flex;
    flex-direction: column;
    span:nth-child(2){
      margin-top: 3px;
      font-size: 13px;
    }
  }
}
</style>
