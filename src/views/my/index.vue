<template>
  <div class="myHome">
    <el-card class="card">
      <div slot="header" class="avatar">
        <el-upload
          v-loading="loading"
          class="upload"
          action="http://localhost:8011/common/upload"
          :show-file-list="false"
          :limit="1"
          :auto-upload="true"
          :before-upload="beforeUpload"
          :on-success="uploadOk"
        >
          <!-- 如果没有图片，显示加号图标 -->
          <div v-if="!userInfo.avatar" class="error-img-box">
            <i class="el-icon-picture-outline" style="font-size: 80px; color: #b3b3b3;"></i>
            <span class="el-upload-list__item-actions change-icon">
              <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M994.72 973.44A39.84 39.84 0 0 1 960.8 992H80a39.84 39.84 0 0 1-33.92-18.4 34.4 34.4 0 0 1 0-36.64A40.16 40.16 0 0 1 80 918.24h880a39.84 39.84 0 0 1 34.08 18.4 34.08 34.08 0 0 1 0.64 36.8zM545.44 688a272 272 0 0 1-148 68.64l-96 7.84c-46.24 3.84-71.68 5.92-76.48 5.92a36.96 36.96 0 0 1-26.24-10.72c-12.64-12.48-12.64-12.48-5.12-102.56l8-96a272 272 0 0 1 68.64-148l352-351.2a113.28 113.28 0 0 1 155.84 0l118.88 118.88a109.92 109.92 0 0 1 0 155.36z m299.52-455.2l-118.88-118.88a37.12 37.12 0 0 0-51.84 0l-352 352a195.52 195.52 0 0 0-48 102.24l-8 96-2.56 30.88 30.88-2.56 96-8a196.64 196.64 0 0 0 102.24-48l352-351.04a37.12 37.12 0 0 0 0-51.84z"></path></svg>
            </span>
          </div>
          <!-- 如果有图片，显示图片及操作图标 -->
          <div v-else style="position: relative; width: 200px; height: 200px">
            <el-avatar
              class="el-upload-list__item-thumbnail img"
              :src="user?.avatar"
              alt=""
            />
            <span class="el-upload-list__item-actions change-icon">
              <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M994.72 973.44A39.84 39.84 0 0 1 960.8 992H80a39.84 39.84 0 0 1-33.92-18.4 34.4 34.4 0 0 1 0-36.64A40.16 40.16 0 0 1 80 918.24h880a39.84 39.84 0 0 1 34.08 18.4 34.08 34.08 0 0 1 0.64 36.8zM545.44 688a272 272 0 0 1-148 68.64l-96 7.84c-46.24 3.84-71.68 5.92-76.48 5.92a36.96 36.96 0 0 1-26.24-10.72c-12.64-12.48-12.64-12.48-5.12-102.56l8-96a272 272 0 0 1 68.64-148l352-351.2a113.28 113.28 0 0 1 155.84 0l118.88 118.88a109.92 109.92 0 0 1 0 155.36z m299.52-455.2l-118.88-118.88a37.12 37.12 0 0 0-51.84 0l-352 352a195.52 195.52 0 0 0-48 102.24l-8 96-2.56 30.88 30.88-2.56 96-8a196.64 196.64 0 0 0 102.24-48l352-351.04a37.12 37.12 0 0 0 0-51.84z"></path></svg>
            </span>
          </div>
        </el-upload>
        <div class="user-info">
          <el-form class="form" :rules="rules" :model="user" label-position="right" label-width="60px">
            <el-form-item label="昵称" prop="name">
              <el-input
                size="small"
                v-model="user.name"
              />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input
                size="small"
                v-model="user.phone"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                size="small"
                v-model="user.email"
              />
            </el-form-item>
            <el-form-item label="标签">
              <span>
                <el-tag
                  v-for="tag in user.tag"
                  @close="handleClose(tag)"
                  :key="tag"
                  :disable-transitions="true"
                  size="small"
                  closable
                  effect="dark"
                >
                {{tag}}
              </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="card-body">
        <div class="card-left">
          <el-input v-model="user.sign" maxlength="50" placeholder="编辑个人签名"></el-input>
        </div>
        <div class="card-right">
          <i v-if="!isUpdate">By {{userInfo.createTime}}</i>
          <span class="btn" v-if="isUpdate">
            <el-popconfirm
              title="确认修改个人信息吗?"
              @confirm="submit"
            >
            <el-button type="success" icon="el-icon-check" circle slot="reference"></el-button>
          </el-popconfirm>
          <el-popconfirm
            title="确认取消修改个人信息吗?"
            @confirm="exitUpdate"
          >
          <el-button type="primary" icon="el-icon-close" circle slot="reference"></el-button>
        </el-popconfirm>
        </span>
        </div>
      </div>
    </el-card>
    <el-tabs class="tabs" v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="我的歌单" name="first" :lazy="true">
        <div class="my-playlist">
          <Block v-for="item in collect.musicFormList" :key="item.id">
            <template #img>
              <el-image
                v-if="item.image !== undefined"
                :src="item.image"
                style="width: 100%;
                height: 100%;
                border-radius: 5px"
                fit="cover"
                :lazy="true"
                alt=""
                @click="$router.push(`/detail/music-form/${item.id}`)"
              ></el-image>
            </template>
            <template #nameOne>
              <i @click="$router.push(`/detail/music-form/${item.id}`)">{{item.name}}</i>
            </template>
            <template #nameTwo>
              歌单
            </template>
          </Block>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的设置" name="setting">
        <Settings></Settings>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="身份验证"
      width="25%"
      top="30vh"
      :modal="false"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="close"
    >
      <el-form size="small" :model="sign" :rules="{
            email: [{
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请填写正确邮箱', trigger: 'change'
            }]
          }" ref="ruleForm" style="">
        <el-form-item prop="email">
          <el-input :disabled="true" size="medium" class="input-item" placeholder="请输入邮箱" v-model.trim="sign.email" prefix-icon="el-icon-s-promotion" clearable>
            <template slot="append">
              <!--                  <span>获取验证码</span>-->
              <el-link :disabled="isSendCode" type="success" @click="getCode">{{codeName}}</el-link>
              <!--                  <el-button disabled="true" size="medium" class="input-item" type="primary" @click="getCode">获取验证码</el-button>-->
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" class="input-item" placeholder="请输入验证码" v-model.trim="sign.code" ></el-input>
        </el-form-item>
<!--        <el-button size="medium" class="input-item" type="primary" @click="getCode">登陆</el-button>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { getCodeApi, getUser, updateUserInfo } from '@/api/user'
import { Notification } from 'element-ui'
import Block from '@/components/bolck/Block.vue'
import Settings from '@/components/layout/Settings.vue'
export default {
  name: 'myHome',
  components: { Block, Settings },
  created () {
    this.user = { ...this.userInfo }
  },
  mounted () {
    getUser().then(res => {
      this.user = res.data
    })
  },
  data () {
    return {
      // 对话框显示控制
      dialogVisible: false,
      // dynamicTags: ,
      inputVisible: false,
      inputValue: '',
      // 表单正则
      rules: {
        name: [
          { pattern: /^[a-zA-Z0-9]{3,15}$/, message: '请填写3到15位不包含特殊字符的昵称', trigger: 'change' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '请填写正确手机号', trigger: 'change' }
        ],
        email: [
          { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请填写正确的邮箱格式', trigger: 'change' }
        ]
      },
      // 控制上传头像loading效果显示
      loading: false,
      // 控制修改取消修改button
      isUpdate: false,
      user: {
        name: '',
        email: '',
        phone: '',
        avatar: '',
        sign: '',
        tag: []
      },
      dialogPromiseResolve: null,
      // 是否发送code码
      isSendCode: false,
      // 等待总时
      totalTime: 60,
      timer: null,
      codeName: '发送验证码',
      sign: {
        code: '',
        email: '',
        type: 'verify'
      },
      // 控制Tabs 标签页
      activeName: 'first'
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapGetters('user', ['getProperty']),
    ...mapState('collect', ['collect'])
    // name: {
    //   get () {
    //     return this.getProperty('name')
    //   },
    //   set (value) {
    //     this.updateProperty({ property: 'name', value })
    //   }
    // },
    // phone: {
    //   get () {
    //     return this.getProperty('phone')
    //   },
    //   set (value) {
    //     this.updateProperty({ property: 'phone', value })
    //   }
    // },
    // email: {
    //   get () {
    //     return this.getProperty('email')
    //   },
    //   set (value) {
    //     this.updateProperty({ property: 'email', value })
    //   }
    // },
    // avatar: {
    //   get () {
    //     return this.getProperty('avatar')
    //   },
    //   set (value) {
    //     this.updateProperty({ property: 'avatar', value })
    //   }
    // },
    // sex: {
    //   get () {
    //     return this.getProperty('sex')
    //   },
    //   set (value) {
    //     this.updateProperty({ property: 'sex', value })
    //   }
    // }
  },
  methods: {
    /*
      点击取消tag
     */
    handleClose (tag) {
      this.user.tag.splice(this.user.tag.indexOf(tag), 1)
    },
    /*
      点击btn显示input
     */
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /*
      input输入完成
     */
    handleInputConfirm () {
      if (this.inputValue) {
        this.user.tag.push(this.inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    ...mapMutations('user', ['setUserInfo']),
    ...mapActions('user', ['updateProperty', 'getUser']),
    /*
      退出修改个人信息
     */
    exitUpdate () {
      this.user = { ...this.userInfo }
      this.isUpdate = false
    },
    /*
      提交个人修改信息
     */
    async submit () {
      const { name, email, phone, avatar, sign, tag } = this.user
      if (this.userInfo.email !== email || this.userInfo.phone !== phone) {
        const result = await this.showDialog()
        if (!result) {
          // 用户取消操作，终止提交流程
          return
        }
      }
      await updateUserInfo(name, email, phone, avatar, sign, tag)
      this.$message({
        message: '恭喜您，修改成功',
        type: 'success'
      })
      const { data } = await getUser()
      this.user = data
      this.setUserInfo(data)
      this.exitUpdate()
    },
    /*
      修改头像 图片上传前
     */
    beforeUpload (file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传图片只能是 png/jpg 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      if (isImage && isLt2M) {
        this.loading = true
      }
      return isImage && isLt2M
    },
    /*
      图片上传成功回调
     */
    uploadOk (res) {
      this.loading = false
      this.user.avatar = res.data
    },
    /*
      dialog关闭
     */
    close () {
      if (this.dialogPromiseResolve) {
        this.dialogPromiseResolve(false)
        this.dialogVisible = false
        this.dialogPromiseResolve = null
      }
    },
    /*
      dialog取消
     */
    handleCancel () {
      this.dialogVisible = false
      if (this.dialogPromiseResolve) {
        this.dialogPromiseResolve(false)
        this.dialogPromiseResolve = null
      }
    },
    /*
      dialog提交
     */
    async handleConfirm () {
      if (this.sign.code === '') {
        return Notification.error({
          title: '错误',
          message: '数据不能为空',
          showClose: false
        })
      }
      const token = await this.$recaptcha('email')
      const { data } = await getCodeApi(this.sign, token)
      this.$message({
        message: data,
        type: 'success'
      })
      this.initialize()
      if (this.dialogPromiseResolve) {
        this.dialogPromiseResolve(true)
        this.dialogPromiseResolve = null
      }
      this.dialogVisible = false
    },
    showDialog () {
      this.dialogVisible = true
      return new Promise((resolve) => {
        this.dialogPromiseResolve = resolve
      })
    },
    async getCode () {
      // 人机验证
      const token = await this.$recaptcha('email')
      const res = await getCodeApi(this.sign, token)
      // 消息添加成功 显示提示 禁用组件
      this.isSendCode = true
      this.$message({
        message: res.data,
        type: 'success'
      })
      this.timer = setInterval(() => {
        this.totalTime--
        this.codeName = this.totalTime + 's后重新发送'
        if (this.totalTime < 0) {
          this.initialize()
        }
      }, 1000)
    },
    initialize () {
      this.sign = {
        code: '',
        email: '',
        type: 'verify'
      }
      clearInterval(this.timer)
      this.codeName = '重新发送验证码'
      this.totalTime = 60
      this.isSendCode = false
    },
    // Tabs 标签页点击事件
    handleTabClick () {

    }
  },
  watch: {
    /*
      输入框的值改变显示提交 取消提交button
     */
    user: {
      handler (newVal, oldVal) {
        /*
          oldVal.id == null 第一次数据初始化不显示btn
          点击取消btn执行exitUpdate()会重新初始化user数据
          newVal !== oldVal 修改过数据才会显示btn，重新初始化数据所以不相等
         */
        if (oldVal.name == null || newVal !== oldVal) {
          return
        }
        this.isUpdate = true
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/mixin";
.myHome{
  $wth: 800px;
  margin: 20px;
  position: relative;
  .card{
    min-width: $wth;
    .avatar{
      display: flex;
      align-items: center;
      .user-info{
        display: flex;
        margin-left: 10px;
        width: $wth;
        .form{
          width: 100%;
          .el-form-item{
            margin-bottom: 12px;
            width: 18rem;
            @include updateInput();
            &:nth-last-child(1){
              width: $wth - 200px;
            }
          }
        }
      }
      .upload{
        .img{
          border-radius: 5px;
          position: relative;
          width: 100%;
          height: 100%;
          display: block;
        }
        .change-icon{
          border-radius: 5px;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon{
            width: 50px;
            height: 50px;
            fill: #FFFFFF;
          }
          &:hover{
            background-color: rgb(0 0 0 / 50%);
            opacity: 1;
            transition: all .2s;
          }
        }
      }
    }
    .card-body{
      $body-width: $wth / 2 + 100px;
      display: flex;
      align-items: center;
      .card-left{
        min-width: $body-width ;
        width: $body-width;
        margin-right: auto;
        @include updateInput();
      }
      .card-right{
        margin-left: auto;
        i{
          color: #C0C4CC;
          font-size: 14px;
        }
        .btn{
          button {
            margin: 0 10px 0 0;
          }
        }
      }
    }
  }
  .tabs{
    margin-top: 20px;
    .my-playlist{
      display: flex;
    }
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
