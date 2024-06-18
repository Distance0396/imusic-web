<script>
export default {
  name: 'ActionBar',
  methods: {
    submit () {
      this.$emit('submitPlay')
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
    <span class="follow">
      <slot></slot>
    </span>
  </div>
</template>

<style scoped lang="less">
.action {
  padding: 20px 0 20px 20px;
  display: flex;
  align-items: center;
  width: 20rem;
  .play {
    fill: #ffffff;
    display: flex;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #2e6aff;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    &:hover{
      background-color: #004dff;
      transition: background-color .3s;
    }
  }
  .follow {
    font-size: 2vh;
    display: flex;
    align-items: center;
    justify-content: center;
    //width: 56px;
    height: 32px;
    border-radius: 15px;
    //border: 1px solid #121212;
    i{
      font-size: 15px;
    }
  }
}
</style>
