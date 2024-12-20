<script>
import { getCodeApi, login, register } from '@/api/user'
import { Notification } from 'element-ui'
import { setToken } from '@/utils/storage'

export default {
  name: 'LoginIndex',
  data () {
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
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
        loginIn: {
          account: [
            // { required: true, message: '账号不能为空', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9]{6,13}$/, message: '请填写6-13位账号不包含特殊字符', trigger: 'change' }
          ],
          password: [
            // { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
        loginUp: {
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
        emailRules: {
          email: [
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ]
        }
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
      codeName: '发送验证码',
      requestLoading: false
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
      this.requestLoading = true
      // 人机验证
      await this.$recaptcha('login').then((token) => {
        login(this.landing, token).then(res => {
          // 将返回结果通过store存入本地
          // setToken(res.data)
          this.$store.commit('user/setToken', res.data.token)
          // 判断有无回调地址
          const url = this.$route.query.backUrl || '/'
          this.$router.replace(url)
          this.requestLoading = false
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
      this.requestLoading = true
      await register(this.register)
      this.hidden = !this.hidden
      this.requestLoading = false
    },
    handleSelect (e) {
      this.activeIndex = e
      e === 'signIn' ? this.showEmail = false : this.showEmail = true
      // this.sign.type = e
    },
    async getCode () {
      // 判断是否填写邮箱
      if (this.sign.email === '') {
        return Notification.error({ title: '错误', message: '邮箱为空', showClose: false })
      }
      if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(this.sign.email) === false) {
        return Notification.error({ title: '错误', message: '邮箱格式错误', showClose: false })
      }
      // 人机验证
      const recaptcha = await this.$recaptcha('email')
      getCodeApi(this.sign, recaptcha).then(res => {
        // 消息添加成功 显示提示 禁用组件
        this.isSendCode = true
        if (!this.sign.code) {
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
          return this.$message({
            message: '邮件发送成功',
            type: 'success'
          })
        }
        // 响应数据携带数据将token存到vuex
        if (res.data !== null) {
          setToken(res.data)
          const url = this.$route.query.backUrl || '/'
          this.$router.replace(url)
        }
      })
    },
    changeHidden () {
      this.hidden = !this.hidden
      this.hidden === true ? this.sign.type = 'signIn' : this.sign.type = 'signUp'
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
          <el-form size="medium" v-if="hidden && !showEmail" :model="landing" :rules="rules.loginIn" ref="ruleForm" label-width="100px" class="form-left public">
            <el-form-item prop="account">
              <el-input class="input-item" placeholder="请输入账号" v-model.trim="landing.account" prefix-icon="el-icon-user-solid" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input class="input-item" placeholder="请输入密码" v-model.trim="landing.password" prefix-icon="el-icon-message-solid" show-password></el-input>
            </el-form-item>
            <el-button :loading="requestLoading" size="medium" class="input-item" type="primary" @click="login">登陆</el-button>
          </el-form>
          <el-form size="medium" v-if="hidden && showEmail" :model="sign" :rules="rules.emailRules" label-width="100px" class="form-left public">
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
            <el-button :loading="requestLoading" size="medium" class="input-item" type="primary" @click="getCode">登陆</el-button>
          </el-form>
        </div>
        <div>
          <el-form size="medium" v-if="!hidden && !showEmail" :model="register" :rules="rules.loginUp" class="form-right public">
            <el-form-item prop="name">
              <el-input class="input-item" placeholder="昵称" v-model.trim="register.name" clearable></el-input>
            </el-form-item>
            <el-form-item prop="account">
              <el-input class="input-item" placeholder="账号" v-model.trim="register.account" clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input class="input-item" placeholder="密码" v-model.trim="register.password" show-password></el-input>
            </el-form-item>
            <el-button :loading="requestLoading" size="medium" type="primary" @click="RegAccount">注册账号</el-button>
          </el-form>
          <el-form size="medium" v-if="!hidden && showEmail" :model="sign" :rules="rules.emailRules" class="form-right public">
            <el-form-item prop="email">
              <el-input :disabled="isSendCode" class="input-item" placeholder="请输入邮箱" v-model.trim="sign.email" prefix-icon="el-icon-s-promotion" clearable>
                <template slot="append">
                  <el-link :disabled="isSendCode" size="success" class="input-item" @click="getCode">{{codeName}}</el-link>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input class="input-item" placeholder="请输入验证码" v-model.trim="sign.code"></el-input>
            </el-form-item>
            <el-button :loading="requestLoading" size="medium" type="primary" @click="getCode">注册账号</el-button>
          </el-form>
        </div>
      </el-menu>
      <div class="click-rolling" @click="changeHidden">
        <a v-if="hidden">注册账号</a>
        <a v-else>去登陆</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/mixin";
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
    @include respond-to('phone'){
      width: 300px;
      height: 500px;
    }
    @include respond-to('tv'){
      width: 600px;
      height: 300px;
    }
    margin: auto;
    //width: 600px;
    //height: 300px;
    background-color: #ffffff;
    z-index: 100;
    position: relative;
    border-radius: 4px;
    display: flex;
    overflow: hidden;
    .public{
      width: 600px;
      height: 210px;
      @include respond-to('phone'){
        width: 300px;
        height: 500px;
      }
      @include respond-to('tv'){
        width: 600px;
        height: 210px;
      }
      //@include respond-to('tv'){
      //  width: 600px;
      //  height: 210px;
      //}
      //@include respond-to('tv'){
      //  width: 600px;
      //  height: 210px;
      //}
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
      @include respond-to('phone'){
        padding: 100px 30px 0 30px;
      }
      @include respond-to('tv'){
        padding: 35px 120px 0 120px;
      }
      //padding: 35px 120px 0 120px;
    }
    .form-right{
      padding: 15px 120px 0 120px;
      @include respond-to('phone'){
        padding: 100px 30px 0 30px;
      }
      @include respond-to('tv'){
        padding: 15px 120px 0 120px;
      }
      //padding: 15px 120px 0 120px;
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
