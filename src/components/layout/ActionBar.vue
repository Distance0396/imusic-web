<script>
// import { mapGetters } from 'vuex'

export default {
  name: 'ActionBar',
  data () {
    return {
      isFocus: true
    }
  },
  props: {
    isExist: Object,
    isReply: Boolean
  },
  methods: {
    submit () {
      this.$emit('submitPlay')
    },
    attention () {
      this.$emit('attention')
    },
    unfollow () {
      this.$emit('unfollow')
    },
    Reply () {
      this.$emit('update:isReply', !this.isReply)
    }
  },
  mounted () {
  },
  computed: {
    isLogin () {
      return this.$store.getters.token
    }
  }
}
</script>

<template>
  <div class="action">
    <span class="play" @click="submit">
      <svg class="icon" viewBox="0 0 1024 1024"
           xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path
        d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z"
      ></path>
      </svg>
    </span>
    <span v-if="!isExist" class="attention" @click.stop="attention">
      关注
    </span>
    <span v-else class="attention" @click.stop="unfollow">
      关注中
    </span>
    <span @click.stop="Reply" style="fill: #aaaaaa; min-width: 40px; min-height: 40px;">
      <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M853.333333 768c35.413333 0 64-20.650667 64-55.978667V170.581333A63.978667 63.978667 0 0 0 853.333333 106.666667H170.666667C135.253333 106.666667 106.666667 135.253333 106.666667 170.581333v541.44C106.666667 747.285333 135.338667 768 170.666667 768h201.173333l110.016 117.44a42.752 42.752 0 0 0 60.586667 0.042667L651.904 768H853.333333z m-219.029333-42.666667h-6.250667l-115.797333 129.962667c-0.106667 0.106667-116.010667-129.962667-116.010667-129.962667H170.666667c-11.776 0-21.333333-1.621333-21.333334-13.312V170.581333A21.205333 21.205333 0 0 1 170.666667 149.333333h682.666666c11.776 0 21.333333 9.536 21.333334 21.248v541.44c0 11.754667-9.472 13.312-21.333334 13.312H634.304zM341.333333 490.666667a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z m170.666667 0a42.666667 42.666667 0 1 0 0-85.333334 42.666667 42.666667 0 0 0 0 85.333334z"></path></svg>
    </span>
    <span class="follow">
      <slot></slot>
    </span>
  </div>
</template>

<style scoped lang="scss">
.action {
  padding: 20px 0 20px 20px;
  display: flex;
  align-items: center;
  width: 20rem;
  span:nth-child( n + 2 ){
    margin-left: 20px;
  }
  .play {
    fill: #ffffff;
    display: flex;
    min-width: 56px;
    min-height: 56px;
    border-radius: 50%;
    background-color: #409EFF;
    justify-content: center;
    align-items: center;
    //margin-right: 20px;
    &:hover{
      background-color: #3b76ff;
      transition: background-color .3s;
    }
  }
  .follow {
    font-size: 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    border-radius: 15px;
    i{
      font-size: 15px;
    }
    .icon{
      fill: #aeaeae;
      transition: all .2s;
      &:hover{
        fill: #FFFFFF;
      }
    }
  }
  .attention{
    padding: 10px 20px;
    text-align: center;
    border-radius: 20px;
    color: #FFFFFF;
    border: solid 2px #aeaeae;
    &:hover{
      border: solid 2px #FFFFFF;
    }
  }
}
</style>
