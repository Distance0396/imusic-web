<template>
<div class="editor">
  <div>
    <el-button @click="issue" :loading="issueLoading" style="padding: 10px 15px; color: #ffffff;" type="success">发布</el-button>
    <el-button style="padding: 10px 15px; color: #ffffff;" type="warning">丢进草稿箱</el-button>
    <el-button @click="$router.go(-1)" style="padding: 10px 15px; color: #ffffff;" type="info">取消</el-button>
  </div>
  <el-form label-position="top" label-width="100px">
    <el-form-item label="标题">
      <el-input v-model="title"/>
    </el-form-item>
    <el-form-item label="封面">
      <el-upload
        :multiple="false"
        :before-upload="beforeUploadFace"
        :on-success="uploadFaceOk"
        :on-error="uploadError"
        :disabled="uploadLoading"
        :limit="1"
        :headers="uploadHeaders"
        action="/v2/upload/article"
        list-type="picture-card"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="类别">
      <el-select
        v-model="category"
        filterable
        remote
        placeholder="请输入关键词"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="内容">
      <el-tiptap :extensions="extensions" v-model.trim="content" placeholder="Write something ..."/>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import {
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Link,
  Image,
  Blockquote,
  ListItem,
  BulletList, // use with ListItem
  OrderedList, // use with ListItem
  TodoItem,
  TodoList, // use with TodoItem
  TextAlign,
  Indent,
  HorizontalRule,
  HardBreak,
  History,
  // LineHeight,
  // Iframe,
  // CodeBlock,
  // TrailingNode,
  // Table, // use with TableHeader, TableCell, TableRow
  // TableHeader,
  // TableCell,
  // TableRow,
  // FormatClear,
  // TextColor,
  // TextHighlight,
  // Preview,
  // Print,
  Fullscreen
  // SelectAll,
} from 'element-tiptap'
import axios from 'axios'
import { issueArticle } from '@/api/article'
import { getToken } from '@/utils/storage'
export default {
  name: 'EditorIndex',
  data () {
    return {
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }),
        new Underline({ bubble: true }),
        new Italic({ bubble: true }),
        new Strike({ bubble: true }),
        new Link({ bubble: true }),
        new Image({
          uploadRequest: async function (file) {
            const formData = new FormData()
            formData.append('file', file)
            return await axios({
              url: 'https://post123.xyz/v2/upload',
              method: 'post',
              data: formData,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(e => {
              return e.data.data
            })
          }
        }),
        new Blockquote(),
        new TextAlign(),
        new ListItem(),
        new BulletList({ bubble: true }),
        new OrderedList({ bubble: true }),
        new TodoItem(),
        new TodoList(),
        new Indent(),
        new HardBreak(),
        new HorizontalRule({ bubble: true }),
        new Fullscreen(),
        new History()
      ],
      content: '<h2 style="text-align: center">Welcome To Element Tiptap Editor Demo</h2>',
      // 封面上传加载
      uploadLoading: false,
      // 提交加载
      issueLoading: false,
      // 类型
      category: '',
      options: [
        {
          value: 1,
          label: '流行'
        },
        {
          value: 2,
          label: '摇滚'
        },
        {
          value: 3,
          label: 'R&B'
        },
        {
          value: 4,
          label: '电子'
        },
        {
          value: 5,
          label: '民谣'
        }
      ],
      // 标题
      title: '',
      // 封面
      articleFace: {
        face: '',
        width: '',
        height: ''
      },
      uploadHeaders: {
        Token: getToken()
      }
    }
  },
  methods: {
    // 校验数据类型与大小
    beforeUploadFace (file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isImage) {
        this.$message.error('上传图片只能是 png/jpg 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      this.uploadLoading = true
      return isImage && isLt10M
    },
    // 图片上传成功回调
    uploadFaceOk (response) {
      this.articleFace = response.data
      this.uploadLoading = false
    },
    // 上传失败
    uploadError () {
      this.$message.error('上传失败')
      this.uploadLoading = false
    },
    // 发布
    async issue () {
      this.issueLoading = true
      await issueArticle({
        title: this.title,
        content: this.content,
        status: 1,
        category: this.category,
        ...this.articleFace
      }).then(() => {
        this.$message.success('发布成功')
        this.$router.go(-1)
      }).catch(() => {
        this.issueLoading = false
      })
      this.issueLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
.editor{
  padding: 40px 40px;
}
</style>
