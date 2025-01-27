<script>
import { login, signUp } from '@/api/user'

export default {
  name: 'AccountIndex',
  data () {
    return {
      // 登陆
      signIn: {
        account: '',
        password: ''
      },
      rules: {
        signIn: {
          account: [
            // { required: true, message: '账号不能为空', trigger: 'blur' },
            { pattern: /^[a-zA-Z0-9]{6,13}$/, message: '请填写6-13位账号不包含特殊字符', trigger: 'change' }
          ],
          password: [
            // { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
        signUp: {
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
        }
      },
      requestLoading: false,
      signUp: {
        name: '',
        account: '',
        password: ''
      },
      isSign: true
    }
  },
  methods: {
    // 登陆
    async login () {
      if (this.signIn.account === '' || this.signIn.password === '') {
        return this.$message.error({
          title: '错误',
          message: '数据不能为空',
          showClose: false
        })
      }
      this.requestLoading = true
      // 人机验证
      await this.$recaptcha('login').then((token) => {
        login(this.signIn, token).then(res => {
          // 将返回结果通过store存入本地
          // setToken(res.data)
          this.$store.commit('user/setToken', res.data.token)
          // 判断有无回调地址
          const url = this.$route.query.backUrl || '/'
          this.$router.replace(url)
          this.requestLoading = false
        }).catch(() => {
          this.requestLoading = false
        })
      })
    },
    // 注册账号
    async RegAccount () {
      if (this.signUp.name === '' || this.signUp.password === '' || this.signUp.account === '') {
        return this.$message.error({
          title: '错误',
          message: '数据不能为空',
          showClose: false
        })
      }
      this.requestLoading = true
      await signUp(this.signUp)
        .then(() => {
          this.requestLoading = false
        })
        .catch(() => {
          this.requestLoading = false
        })
    }
  }
}
</script>

<template>
<div class="account-box">
  <el-form v-if="isSign" :model="signIn" :rules="rules.signIn" ref="ruleForm" class="account public" size="medium">
    <el-form-item prop="account" label="账号">
      <el-input :disabled="requestLoading" class="input-item" placeholder="请输入账号" v-model.trim="signIn.account" clearable></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input :disabled="requestLoading" class="input-item" placeholder="请输入密码" v-model.trim="signIn.password" show-password></el-input>
    </el-form-item>
    <el-button :loading="requestLoading" size="medium" class="input-item" type="primary" @click="login">登陆</el-button>
  </el-form>
  <el-form v-else :model="signUp" :rules="rules.loginUp" class="form-right public" size="medium" >
    <el-form-item prop="name" label="昵称">
      <el-input class="input-item" placeholder="昵称" v-model.trim="signUp.name" clearable></el-input>
    </el-form-item>
    <el-form-item prop="account" label="账号">
      <el-input class="input-item" placeholder="账号" v-model.trim="signUp.account" clearable></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input class="input-item" placeholder="密码" v-model.trim="signUp.password" show-password></el-input>
    </el-form-item>
    <el-button :loading="requestLoading" size="medium" type="primary" @click="RegAccount">注册账号</el-button>
  </el-form>
  <div style="margin: auto 0 20px 0;">
    <el-divider>其他登陆方式</el-divider>
    <el-button @click="() => isSign = !isSign"  size="small" class="input-item" plain >注册</el-button>
    <el-button @click="() => this.$router.push('/login/email')" size="small" class="input-item" plain >邮件登录</el-button>
  </div>
</div>
</template>

<style scoped lang="scss">
.account-box{
  width: 100%;
  height: 100%;
}
</style>
