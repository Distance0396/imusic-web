<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
  name: 'ReplyInput',
  data () {
    return {
      // 是否显示提交按钮
      isSubmit: false
    }
  },
  methods: {
    ...mapActions('reply', ['updateReplyProperty', 'clear']),
    sub () {
      this.$emit('sub')
      this.isSubmit = false
    },
    input () {
      this.$emit('focus')
      this.isSubmit = true
    }
  },
  computed: {
    ...mapGetters('reply', ['getReplyProperty']),
    ...mapState('user', ['userInfo']),
    content: {
      get () {
        return this.getReplyProperty('content')
      },
      set (value) {
        this.updateReplyProperty({ property: 'content', value })
      }
    }
  }
}
</script>

<template>
  <div class="reply-tool">
    <div class="avatar" style="margin-right: 30px">
      <el-avatar>
        {{userInfo.name.slice(0,1).toUpperCase()}}
      </el-avatar>
    </div>
    <div class="input" style="min-width: 500px; white-space: nowrap;">
      <el-input
        type="textarea"
        resize='none'
        :autosize="{ minRows: 2}"
        placeholder="万水千山总是情，评论两句行不行"
        v-model="content"
        maxlength="1000"
        show-word-limit
        @focus="input"
      >
      </el-input>
      <div class="btn-box" :class="{ hide: !isSubmit}">
        <el-button class="btn" type="primary" @click="sub">提交</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.reply-tool{
  padding: 20px 0;
  margin-bottom: 10px;
  display: flex;
  .input{
    .btn-box{
      display: flex;
      margin-top: 10px;
      height: 36px;
      transition: all .3s ease-in-out;
      .btn{
        margin-left: auto;
      }
    }
    .hide{
      margin-top: -30px;
      height: 0;
      overflow: hidden;
      transition: all .2s ease-in-out;
    }
  }
}
</style>
