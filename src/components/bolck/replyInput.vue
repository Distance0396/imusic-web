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
  beforeDestroy () {
    this.clear()
  },
  methods: {
    ...mapActions('comment', ['updateCommentProperty', 'clear']),
    sub () {
      this.$emit('sub', this.content)
      this.isSubmit = false
    },
    focus () {
      this.$emit('focus')
      this.isSubmit = true
    },
    blur () {
      setTimeout(() => {
        this.isSubmit = false
      }, 200)
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapState('comment', ['content']),
    ...mapGetters('comment', ['getCommentProperty']),
    content: {
      get () {
        return this.getCommentProperty('content')
      },
      set (value) {
        this.updateCommentProperty({
          property: 'content',
          value
        })
      }
    }
  }
}
</script>

<template>
  <div class="reply-tool">
    <div class="avatar" style="margin-right: 30px">
      <el-avatar :src="this.$store.state.user.userInfo.avatar"/>
    </div>
    <div class="input" style="min-width: 500px; white-space: nowrap;">
      <el-input
        type="textarea"
        resize='none'
        :autosize="{ minRows: 2}"
        :placeholder="this.$store.state.comment.actionUserName ? '回复 @' + this.$store.state.comment.actionUserName : '万水千山总是情，评论两句行不行'"
        v-model="content"
        maxlength="1000"
        show-word-limit
        @focus="focus"
        @blur="blur"
      >
      </el-input>
      <div class="btn-box" :class="{ hide: !this.isSubmit}">
        <el-button class="btn" type="primary" @click="sub">提交</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
