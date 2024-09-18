<script>
import { mapState } from 'vuex'
import { updateSettings, updateUserInfo } from '@/api/user'
import { removeMusicFormList, removeToken } from '@/utils/storage'

export default {
  name: 'SettingsIndex',
  created () {
    this.setting = { ...this.settings }
  },
  data () {
    return {
      setting: {
        id: null,
        userId: null,
        language: '',
        privacyLevel: '',
        quality: '',
        emailInform: null,
        createTime: '',
        updateTime: ''
      },
      action: true,
      password: '',
      rewritePassword: ''
    }
  },
  computed: {
    ...mapState('user', ['settings'])
  },
  methods: {
    switchEmail (e) {
      this.setting.emailInform = e
      this.update()
    },
    async update () {
      await updateSettings(this.setting)
    },
    change () {
      this.action = !this.action
    },
    async updatePassword () {
      if (this.password !== this.rewritePassword) {
        return this.$message({
          message: '密码不相等',
          type: 'warning'
        })
      }
      await updateUserInfo(null, null, null, null, null, null, this.password)
      await this.$router.push('/login')
      removeToken()
      removeMusicFormList()
      location.reload()
    }
  }
}
</script>

<template>
  <el-form ref="form" class="my-form" @change="change" :model="setting" label-position="top" label-width="80px">
    <el-form-item label="语言">
      <span>选择语言</span>
      <span class="form-right">
        <el-select size="mini" v-model="setting.language" @change="update">
          <el-option
            v-for="item in [{
            value: 'zh-CN',
            label: '中文'
          },{
            value: 'en-US',
            label: 'English'
          }]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
    </el-form-item>
    <el-form-item label="隐私级别">
      <span>个人信息可见度</span>
      <span class="form-right">
        <el-select size="mini" v-model="setting.privacyLevel" @change="update">
          <el-option
            v-for="item in [{
                value: 'public',
                label: '所有人'
              },{
                value: 'friends',
                label: '好友可见'
              },{
                value: 'private',
                label: '私密'
              }]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
    </el-form-item>
    <el-form-item label="音质">
      <span>播放音频品质</span>
      <span class="form-right">
        <el-select size="mini" v-model="setting.quality" @change="update">
          <el-option
            v-for="item in [{
              value: 'low',
              label: '低'
            },{
              value: 'medium',
              label: '标准'
            },{
              value: 'high',
              label: '高'
            }]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
    </el-form-item>
    <el-form-item label="邮件">
      <span>是否允许发送推广邮件</span>
      <span class="form-right">
        <el-switch
          v-model="setting.emailInform"
          @change="switchEmail"
          :active-value=0
          :inactive-value=1
        >
        </el-switch>
      </span>
    </el-form-item>
    <el-form-item label="账号">
      <span>
        <i v-if="action">确保密码安全，以增强帐户安全性。</i>
        <el-form v-if="!action" class="password" label-position="top" label-width="80px">
          <el-form-item label="新的密码" style="width: 300px">
            <el-input v-model="password" show-password size="mini"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" style="width: 300px">
            <el-input v-model="rewritePassword" show-password size="mini"></el-input>
          </el-form-item>
          <el-button type="primary" size="mini" @click="updatePassword">更新密码</el-button>
        </el-form>
      </span>
      <span class="form-right" @click="change">
        <el-button type="primary" size="small" plain>{{ action ? '更改密码' : '隐藏' }}</el-button>
      </span>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.my-form{
  margin: auto;
  width: 800px;
  ::v-deep .el-form-item{
    .el-form-item__label{
      color: black;
      font-size: 20px;
    }
    .el-form-item__content{
      display: flex;
      //align-items: center;
      color: #606266;
      .form-right{
        margin-left: auto;
      }
    }
  }
  ::v-deep .password .el-form-item__label{
    padding: 0;
    font-size: 14px;
    color: #606266;
  }
}
</style>
