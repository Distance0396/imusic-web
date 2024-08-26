<script>
import { login, register } from '@/api/user'
import { Notification } from 'element-ui'
// import { reCAPTCHA } from '@/api/common'
// import { useReCaptcha } from 'vue-recaptcha-v3'
// import { mapMutations } from 'vuex'

export default {
  name: 'LoginIndex',
  data () {
    return {
      hidden: true,
      active: true,
      img: [
        {
          id: 1,
          img: require('@/assets/image/ab67616d00001e02a86c7932c5072d2221907af1.jpg')
        },
        {
          id: 12,
          img: require('@/assets/image/ab67616d00001e021615d51c49ccf1f6afd81b6c.jpg')
        },
        {
          id: 10,
          img: require('@/assets/image/ab67616d00001e027b2dd792101b91625f3f1b97.jpg')
        },
        {
          id: 5,
          img: require('@/assets/image/ab67616d00001e024973a7d9304de53e18583220.jpg')
        },
        {
          id: 6,
          img: require('@/assets/image/ab67616d00001e02edfdb3d781e102b176000a88.jpg')
        },
        {
          id: 7,
          img: require('@/assets/image/ab67616d00001e021d210622badaad3d869038ef.jpg')
        },
        {
          id: 13,
          img: require('@/assets/image/ab67616d00001e02110af1ee291450d9e86a05a4.jpg')
        },
        {
          id: 3,
          img: require('@/assets/image/ab67616d00001e02e0eeb4148f2c84ba6ccd8b68.jpg')
        },
        {
          id: 4,
          img: require('@/assets/image/ab67616d00001e02e2e8f804c2cdd5b3815adbf9.jpg')
        },
        {
          id: 16,
          img: require('@/assets/image/ab67616d00001e02147338ef86c5cccef39f1ca1.jpg')
        }
      ],
      register: {
        name: '',
        account: '',
        password: ''
      },
      landing: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{6,13}$/, message: '请填写6-13位账号不包含特殊字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      registerRules: {
        name: [
          { required: true, message: '昵称不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{3,10}$/, message: '请填写3到10位不包含特殊字符的昵称', trigger: 'change' }
        ],
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{6,13}$/, message: '请填写6-13位账号不包含特殊字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { pattern: /[^[^\u4e00-\u9fa5]{6,20}$/, message: '请填写6到20位不包含中文字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // ...mapMutations('random', ['setSinger', 'setAlbum']),
    // 登陆
    async login () {
      // const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()
      if (this.landing.account === '' || this.landing.password === '') {
        return Notification.error({
          title: '错误',
          message: '数据不能为空',
          showClose: false
        })
      }
      // 人机验证
      await this.$recaptcha('login').then((token) => {
        login(this.landing, token).then(res => {
          // 将返回结果通过store存入本地
          this.$store.commit('user/setToken', res.data)
          // 判断有无回调地址
          const url = this.$route.query.backUrl || '/'
          this.$router.replace(url)
        })
      })
    },
    // 注册账号
    async RegAccount () {
      if (this.register.name === '' || this.register.password === '' || this.register.account === '') {
        return Notification.error({
          title: '错误',
          message: '数据不能为空',
          showClose: false
        })
      }
      register(this.register).then(res => {
        console.log(res)
        this.hidden = !this.hidden
      })
    }
  }
}
</script>

<template>
  <div class="login">
    <div class="background">
      <img class="img" v-for="item in img" :key="item.id" :src="item.img" alt="">
    </div>
    <div class="blur">
    </div>
    <div class="register">
<!--      <form action="#" class="form-left public">-->
      <transition name="el-fade-in">
        <el-form v-show="hidden" :model="landing" :rules="rules" ref="ruleForm" label-width="100px" class="form-left public">
          <span>欢迎登陆</span>
          <el-form-item prop="account">
            <el-input class="input-item" placeholder="请输入账号" v-model.trim="landing.account" prefix-icon="el-icon-user-solid" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="input-item" placeholder="请输入密码" v-model.trim="landing.password" prefix-icon="el-icon-message-solid" show-password></el-input>
          </el-form-item>
          <el-button class="input-item" type="primary" @click="login">登陆</el-button>
        </el-form>
      </transition>
      <transition name="el-fade-in">
        <el-form v-show="!hidden" :model="register" :rules="registerRules" class="form-right public">
          <span>注册</span>
          <el-form-item prop="name">
            <el-input class="input-item" placeholder="昵称" v-model.trim="register.name" clearable></el-input>
          </el-form-item>
          <el-form-item prop="account">
            <el-input class="input-item" placeholder="账号" v-model.trim="register.account" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="input-item" placeholder="密码" v-model.trim="register.password" show-password></el-input>
          </el-form-item>
          <el-button type="primary" @click="RegAccount">注册账号</el-button>
        </el-form>
      </transition>
      <div class="click-rolling" >
        <a @click="hidden = !hidden" v-if="hidden">注册账号</a>
        <a @click="hidden = !hidden" v-else>去登陆</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
body {
  margin: 0;
  overflow: hidden;
}
.login{
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  //background-color: #C0C4CC;
  .background{
    position: absolute;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: 100vh;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .blur{
    width: 100%;
    height: 100%;
    position: absolute;
    background-image: radial-gradient(transparent 2px, #ffffff 4px);
    background-size: 4px 4px;
    backdrop-filter: blur(8px);
    filter: blur(1px);
    z-index: 2;
  }
  .register{
    margin: auto;
    width: 600px;
    height: 300px;
    background-color: #ffffff;
    z-index: 100;
    position: relative;
    border-radius: 4px;
    display: flex;
    overflow: hidden;
    .public{
      width: 600px;
      height: 300px;
      display: flex;
      flex-direction: column;
    }
    span{
      font-size: 20px;
      margin-bottom: 20px;
    }
    .el-form-item /deep/ .el-form-item__content{
        margin-left: 0 !important;
    }
    .form-left{
      padding: 45px 120px;
      position: absolute;
      left: 0px;
      transition: left .5s;
    }
    .form-right{
      //position: absolute;
      //right: -800px;
      transition: right .5s;
      padding: 12px 120px;
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
