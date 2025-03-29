<script>
import { getCodeApi } from '@/api/user'
import { setToken } from '@/utils/storage'

export default {
  name: 'EmailIndex',
  data() {
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
      requestLoading: false,
      // 是否发送code码
      isSendCode: false,
      // 等待总时
      totalTime: 60,
      timer: null,
      codeName: '发送验证码',
      emailRules: {
        email: [
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
      },
      signEmail: {
        code: '',
        type: '',
        email: '',
      },
    }
  },
  methods: {
    async getCode() {
      // 判断是否填写邮箱
      if (this.signEmail.email === '') {
        return this.$message.error({
          title: '错误',
          message: '邮箱为空',
          showClose: false,
        })
      }
      if (
        /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(
          this.signEmail.email
        ) === false
      ) {
        return this.$message.error({
          title: '错误',
          message: '邮箱格式错误',
          showClose: false,
        })
      }
      // 人机验证
      const recaptcha = await this.$recaptcha('email')
      getCodeApi(this.signEmail, recaptcha).then(res => {
        // 消息添加成功 显示提示 禁用组件
        this.isSendCode = true
        if (!this.signEmail.code) {
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
            type: 'success',
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
  },
}
</script>

<template>
  <div class="email-box">
    <el-form
      size="medium"
      :model="signEmail"
      :rules="emailRules"
      class="email public"
    >
      <el-form-item prop="email" label="邮箱">
        <el-input
          :disabled="isSendCode"
          class="input-item"
          placeholder="请输入邮箱"
          v-model.trim="signEmail.email"
          prefix-icon="el-icon-s-promotion"
          clearable
        >
          <template slot="append">
            <el-link
              :disabled="isSendCode"
              size="success"
              class="input-item"
              @click="getCode"
            >
              {{ codeName }}
            </el-link>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" label="验证码">
        <el-input
          class="input-item"
          placeholder="请输入验证码"
          v-model.trim="signEmail.code"
        ></el-input>
      </el-form-item>
      <el-button
        :loading="requestLoading"
        size="medium"
        type="primary"
        @click="getCode"
      >
        登录
      </el-button>
    </el-form>
    <div style="margin: auto 0 20px 0">
      <el-divider>其他登陆方式</el-divider>
      <el-button
        @click="() => this.$router.push('/login/account')"
        size="small"
        class="input-item"
        plain
      >
        账号登录/注册
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.email-box {
  width: 100%;
  height: 100%;
}
</style>
