<script>
import { mapActions, mapState } from 'vuex'
import { saveComment } from '@/api/comment'
import { getArticleById } from '@/api/article'

export default {
  name: 'articleIndex',
  // components: { Reply, ReplyInput },
  created() {
    this.getArticle()
  },
  methods: {
    ...mapActions('comment', ['clear']),
    // 提交评论
    async submit() {
      await saveComment({
        ...this.comment,
        replyUserId: this.replyUserId,
        root: this.rootId,
        parent: this.parent,
        content: this.content,
      })
      await this.clear()
    },
    async getArticle() {
      this.loading = true
      const { data } = await getArticleById(this.getArticleId)
      this.loading = false
      this.articleData = data
    },
  },
  computed: {
    ...mapState('comment', ['content', 'replyUserId', 'rootId', 'parent']),
    getArticleId() {
      return +this.$route.params.id
    },
  },
  data() {
    return {
      articleData: null,
      loading: true,
      activeName: 'reply',
    }
  },
}
</script>

<template>
  <div
    class="article"
    v-title
    data-title="蓝，不止蓝 ——浅谈R&B中的音乐与色彩之美"
    style="padding: 50px 0 20px 0; height: 100%; margin: 20px auto"
  >
    <el-skeleton animated :loading="loading">
      <template slot="template">
        <div style="padding: 0 40px">
          <el-skeleton-item variant="h1" style="height: 100px" />
          <div style="margin-top: 20px; display: flex; align-items: center">
            <el-skeleton-item
              variant="text"
              style="
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 20px;
              "
            />
            <el-skeleton-item
              variant="text"
              style="width: 8%; height: 30px; margin-right: 20px"
            />
            <!--            <el-skeleton-item variant="text" style="width: 8%; height: 30px; margin-right: 20px;"/>-->
            <el-skeleton-item
              variant="text"
              style="
                width: 8%;
                height: 30px;
                margin-right: 20px;
                margin-left: auto;
              "
            />
          </div>
          <div style="margin-top: 50px">
            <el-skeleton-item
              style="width: 100%; height: 30px; margin-top: 10px"
              variant="text"
            />
            <el-skeleton-item
              style="width: 100%; height: 30px; margin-top: 10px"
              variant="text"
            />
            <el-skeleton-item
              style="width: 100%; height: 30px; margin-top: 10px"
              variant="text"
            />
            <el-skeleton-item
              style="width: 100%; height: 30px; margin-top: 10px"
              variant="text"
            />
            <el-skeleton-item
              style="width: 100%; height: 30px; margin-top: 10px"
              variant="text"
            />
            <el-skeleton-item
              style="width: 100%; height: 30px; margin-top: 10px"
              variant="text"
            />
          </div>
        </div>
      </template>
      <template>
        <h1 class="title">{{ articleData?.title }}</h1>
        <div class="info">
          <div class="avatar">
            <img
              style="width: 100%; height: 100%"
              :src="articleData?.user?.avatar"
              alt="加载失败"
            />
          </div>
          <span class="username" @click="() => $router.push(`/user/${1}`)">
            {{ articleData?.user?.name }}
          </span>
          <div class="follow">关注</div>
        </div>
        <div class="content" v-html="articleData?.content"></div>
        <div class="reply">
          <!--          <ReplyInput @sub="submit" @focus="clear" />-->
          <!--          <Reply v-for="item in reply" :key=" 'reply' + item.id" :item="item"-->
          <!--                 @more="more"-->
          <!--                 @submit="submit"-->
          <!--                 @like="like"-->
          <!--                 @unlike="unlike"-->
          <!--          />-->
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/index';
.article {
  min-height: calc(100vh - $footer - 40px);
  .title {
    color: var(--text-color);
    font-size: 40px;
    padding: 0 40px;
  }
  .info {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 0 40px;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;
    }
    .username {
      color: var(--text-color);
      font-size: 20px;
      &:hover {
        text-decoration: underline;
      }
    }
    .follow {
      background-color: #409eff;
      border-radius: 4px;
      padding: 10px 15px;
      margin-left: auto;
      cursor: pointer;
      transition: all 0.1s ease-out;
      &:hover {
        color: #ffffff;
      }
    }
  }
  .content {
    margin-top: 20px;
    position: relative;
    font-size: 22px;
    padding: 0 40px;
    color: var(--text-color);
    .label {
      margin-top: 60px;
      font-size: 14px;
      span {
        margin-right: 10px;
        border-radius: 20px;
        padding: 8px 15px;
        background-color: var(--label-bg);
        color: var(--label-color);
        transition: all 0.1s ease-out;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .reply {
    height: 100%;
    border-top: #000000 2px solid;
    margin-top: 30px;
    padding: 40px 40px;
  }
}
</style>
