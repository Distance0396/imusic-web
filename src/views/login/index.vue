<script>
import { login, register } from '@/api/user'
import { Notification } from 'element-ui'
export default {
  name: 'LoginIndex',
  data () {
    return {
      active: true,
      register: {
        name: '',
        account: '',
        password: ''
      },
      landing: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    rolling () {
      document.querySelector('.form-left').style.left = '-800px'
      document.querySelector('.form-right').style.right = '0px'
      this.active = false
    },
    rollingLeft () {
      document.querySelector('.form-left').style.left = '0px'
      document.querySelector('.form-right').style.right = '-800px'
      this.active = true
    },
    // 登陆
    login () {
      if (this.landing.account === '' || this.landing.password === '') {
        return Notification.error({
          title: '错误',
          message: '不能为空',
          showClose: false
        })
      }
      login(this.landing)
        .then(res => {
          // 将返回结果通过store存入本地
          this.$store.commit('user/setUser', res.data)
          // 判断有无回调地址
          const url = this.$route.query.backUrl || '/'
          this.$router.replace(url)
        })
    },
    // 注册账号
    RegAccount () {
      if (this.register.name === '' || this.register.password === '' || this.register.account === '') {
        return Notification.error({
          title: '错误',
          message: '不能为空',
          showClose: false
        })
      }
      register(this.register)
        .then(res => {
          console.log(res)
          this.rollingLeft()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<template>
  <div class="login">
    <div class="background">
      <img src="@/style/image/dzp.jpg" alt="">
    </div>
    <div class="blur">
    </div>
    <div class="register">
      <form action="#" class="form-left public">
        <span>欢迎登陆</span>
        <input type="text" name="username" placeholder="账号" class="input-item" v-model="landing.account">
        <input type="password" name="password" placeholder="密码" class="input-item" v-model="landing.password">
        <i @click="login">登陆</i>
      </form>
      <form action="#" class="form-right public">
        <span>注册</span>
        <input type="text" name="name" placeholder="昵称" class="input-item" v-model="register.name">
        <input type="text" name="username" placeholder="账号" class="input-item" v-model="register.account">
        <input type="password" name="password" placeholder="密码" class="input-item" v-model="register.password">
        <i @click="RegAccount">注册</i>
      </form>
      <div class="click-rolling" >
        <a @click="rolling" v-if="active">注册账号</a>
        <a @click="rollingLeft" v-else>去登陆</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.login{
  width: 100%;
  .background{
    position: absolute;
    top: 0;
    width: 100%;
    //height: 100%;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .blur{
    width: 100%;
    height: 100%;
    position: absolute;
    background-image: radial-gradient(transparent 2px, #ffffff 2px);
    background-size: 4px 4px;
    backdrop-filter: blur(8px);
    filter: blur(3px);
    z-index: 2;
  }
  .register{
    margin: auto;
    width: 600px;
    height: 300px;
    background-color: #ffffff;
    z-index: 100;
    position: relative;
    top: 20vh;
    border-radius: 4px;
    display: flex;
    overflow: hidden;
    .public{
      width: 600px;
      height: 300px;
      padding: 45px 120px;
      display: flex;
      flex-direction: column;
    }
    span{
      font-size: 20px;
      margin-bottom: 20px;
    }
    .input-item{
      margin-bottom: 20px;
      border: none;
      outline: none;
      padding: 5px 10px;
      border-bottom:  1px solid #e5e5e5;
      text-align: left;
    }
    .input-item:hover{
      border-bottom-color: #2e6aff;
      transition: border-bottom-color .5s;
    }
    i{
      padding: 5px;
      display: flex;
      justify-content: center;
      background-color: #d0d0d0;
      border-radius: 4px;
      width: 60px;
    }
    i:hover{
      background-color: #c2c2c2;
      transition: background-color .2s;
    }
    .form-left{
      position: absolute;
      left: 0px;
      transition: left .5s;
    }
    .form-right{
      position: absolute;
      right: -800px;
      transition: right .5s;
    }
    .click-rolling{
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    .click-rolling:hover{
      text-decoration: underline;
    }
  }
}

</style>
