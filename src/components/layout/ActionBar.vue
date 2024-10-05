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
