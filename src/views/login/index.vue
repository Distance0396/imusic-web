<script>
import { getCodeApi, login, register } from '@/api/user'
import { Notification } from 'element-ui'

export default {
  name: 'LoginIndex',
  data () {
    return {
      hidden: true,
      active: true,
      // 注册
      register: {
        name: '',
        account: '',
        password: ''
      },
      // 登陆
      landing: {
        account: '',
        password: ''
      },
      sign: {
        code: '',
        type: 'signIn',
        email: ''
      },
      rules: {
        account: [
          // { required: true, message: '账号不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{6,13}$/, message: '请填写6-13位账号不包含特殊字符', trigger: 'change' }
        ],
        password: [
          // { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      registerRules: {
        name: [
          // { required: true, message: '昵称不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{3,15}$/, message: '请填写3到15位不包含特殊字符的昵称', trigger: 'change' }
        ],
        account: [
          // { required: true, message: '账号不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{6,13}$/, message: '请填写6-13位账号不包含特殊字符', trigger: 'change' }
        ],
        password: [
          // { required: true, message: '密码不能为空', trigger: 'blur' },
          { pattern: /[^[^\u4e00-\u9fa5]{6,20}$/, message: '请填写6到20位不包含中文字符', trigger: 'change' }
        ]
      },
      activeIndex: 'signIn',
      // 显示邮件操作
      showEmail: false,
      // 是否发送code码
      isSendCode: false,
      // 等待总时
      totalTime: 60,
      timer: null,
      codeName: '发送验证码'
    }
  },
  methods: {
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
          // }
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
        this.hidden = !this.hidden
      })
    },
    handleSelect (e) {
      this.activeIndex = e
      e === 'signIn' ? this.showEmail = false : this.showEmail = true
      this.sign.type = e
    },
    async getCode () {
      // 判断是否填写邮箱
      if (this.sign.email === '') {
        return Notification.error({
          title: '错误',
          message: '数据不能为空',
          showClose: false
        })
      }
      // 人机验证
      const recaptcha = await this.$recaptcha('email')
      const res = getCodeApi(this.sign, recaptcha)
      const token = res.data.token
      // 消息添加成功 显示提示 禁用组件
      this.isSendCode = true
      if (!this.sign.code) {
        this.$message({
          message: '邮件发送成功',
          type: 'success'
        })
      }
      // 响应数据携带数据将token存到vuex
      if (token !== null) {
        this.$store.commit('user/setToken', res.data)
        const url = this.$route.query.backUrl || '/'
        this.$router.replace(url)
      }
      this.timer = setInterval(() => {
        this.totalTime--
        this.codeName = this.totalTime + 's后重新发送'
        if (this.totalTime < 0) {
          clearInterval(this.timer)
          this.codeName = '重新发送验证码'
          this.totalTime = 60
          this.isSendCode = false
        }
      }, 1000)
      // })
    }
  },
  watch: {
    hidden: {
      handler (newVal) {
        this.sign = {
          code: '',
          type: this.activeIndex,
          email: ''
        }
      }
    }
  }
}
</script>

<template>
  <div class="login">
    <!-- <div class="background"> -->
      <!-- <img class="img" v-for="item in img" :key="item.id" :src="item.img" alt=""> -->
    <!-- </div> -->
    <div class="blur">
      <div class="layer1"></div>
      <div class="layer2"></div>
      <div class="layer3"></div>
      <div class="layer4"></div>
      <div class="layer5"></div>
    </div>
    <div class="register">
      <el-menu :default-active="activeIndex" style="width: 100%;" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="signIn">{{hidden ? "账号登陆" : "注册账号"}}</el-menu-item>
        <el-menu-item index="signUp">{{hidden ? "邮箱登陆" : "邮箱注册"}}</el-menu-item>
        <div>
          <el-form size="medium" v-if="hidden && !showEmail" :model="landing" :rules="rules" ref="ruleForm" label-width="100px" class="form-left public">
            <el-form-item prop="account">
              <el-input class="input-item" placeholder="请输入账号" v-model.trim="landing.account" prefix-icon="el-icon-user-solid" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input class="input-item" placeholder="请输入密码" v-model.trim="landing.password" prefix-icon="el-icon-message-solid" show-password></el-input>
            </el-form-item>
            <el-button size="medium" class="input-item" type="primary" @click="login">登陆</el-button>
          </el-form>
          <el-form size="small" v-if="hidden && showEmail" :model="sign" :rules="{
            email: [{
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请填写正确邮箱', trigger: 'change'
            }]
          }" ref="ruleForm" label-width="100px" class="form-left public">
            <el-form-item prop="email">
              <el-input :disabled="isSendCode" size="medium" class="input-item" placeholder="请输入邮箱" v-model.trim="sign.email" prefix-icon="el-icon-s-promotion" clearable>
                <template slot="append">
                  <el-link :disabled="isSendCode" type="success" @click="getCode">{{codeName}}</el-link>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input size="medium" class="input-item" placeholder="请输入验证码" v-model.trim="sign.code" ></el-input>
            </el-form-item>
            <el-button size="medium" class="input-item" type="primary" @click="getCode">登陆</el-button>
          </el-form>
        </div>
        <div>
          <el-form size="medium" v-if="!hidden && !showEmail" :model="register" :rules="registerRules" class="form-right public">
            <el-form-item prop="name">
              <el-input class="input-item" placeholder="昵称" v-model.trim="register.name" clearable></el-input>
            </el-form-item>
            <el-form-item prop="account">
              <el-input class="input-item" placeholder="账号" v-model.trim="register.account" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input class="input-item" placeholder="密码" v-model.trim="register.password" show-password></el-input>
            </el-form-item>
            <el-button size="medium" type="primary" @click="RegAccount">注册账号</el-button>
          </el-form>
          <el-form size="medium" v-if="!hidden && showEmail" :model="sign" :rules="{
            email: [{
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请填写正确邮箱', trigger: 'change'
            }]
          }" class="form-right public">
            <el-form-item prop="email">
              <el-input class="input-item" placeholder="请输入邮箱" v-model.trim="sign.email" prefix-icon="el-icon-s-promotion" clearable>
                <template slot="append">
                  <el-button size="medium" class="input-item" type="primary" @click="getCode">获取验证码</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input class="input-item" placeholder="请输入验证码" v-model.trim="sign.code"></el-input>
            </el-form-item>
            <el-button size="medium" type="primary" @click="getCode">注册账号</el-button>
          </el-form>
        </div>
      </el-menu>
      <div class="click-rolling" >
        <a @click="hidden = !hidden" v-if="hidden">注册账号</a>
        <a @click="hidden = !hidden" v-else>去登陆</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
body {
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
}
.login{
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .blur{
    height: 100%;
    background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
    overflow: hidden;
    width: 100%;
    position: absolute;
    z-index: 2;

    @function getShadows($n){
      $shadows: '#{random(100)}vw #{random(100)}vh #e1e1e1';
      @for $i from 2 through $n{
        $shadows: '#{$shadows}, #{random(100)}vw #{random(100)}vh #e1e1e1';
      }
      @return unquote($shadows)
    }

    $duration: 800s;
    $count: 1000;
    @for $i from 1 through 5{
      $duration: floor(calc($duration / 2));
      $count: floor(calc($count / 2));
      .layer#{$i}{
        $size: #{$i}px;
        position: fixed;
        // color: #e1e1e1;
        width: $size;
        height: $size;
        border-radius: 50%;
        left: 0;
        top: 0;
        box-shadow: getShadows($count);
        animation: moveUp $duration linear infinite;
        &::after{
          content: '';
          position: fixed;
          // top: 100vh;
          left: -100vw;
          top: 0;
          // left: 0;
          width: $size;
          height: $size;
          border-radius: inherit;
          box-shadow: inherit;
        }
      }
    }

    @keyframes moveUp {
      100% {
        transform: translateX(100vw);
      }
    }
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
      height: 210px;
      display: flex;
      flex-direction: column;
    }
    span{
      font-size: 20px;
      margin-bottom: 20px;
    }
    .el-form-item {
      ::v-deep .el-form-item__content{
        margin-left: 0 !important;
    }
    }
    .form-left{
      padding: 35px 120px 0 120px;
    }
    .form-right{
      padding: 15px 120px 0 120px;
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
