<script>
import ArticleItem from '@/components/block/ArticleItem.vue'
import { getArticleByCategoryId } from '@/api/article'

export default {
  name: 'communityIndex',
  components: {
    ArticleItem
  },
  data () {
    return {
      restaurants: [],
      categoryMock: [
        {
          id: 1,
          name: '流行'
        },
        {
          id: 2,
          name: '摇滚'
        },
        {
          id: 3,
          name: 'R&B'
        },
        {
          id: 4,
          name: '电子'
        },
        {
          id: 5,
          name: '民谣'
        }
      ],
      items: [
        // {
        //   id: 1,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/cb4ef07a-a2b1-4a0d-8cde-a8a5c528c7c0.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 2,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/747d21ba-ee74-4a6d-a3eb-02074de1adb1.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test测试Test测试Test测试Test测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 3,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/747d21ba-ee74-4a6d-a3eb-02074de1adb1.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test测试Test测试Test测试Test测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 4,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/cb4ef07a-a2b1-4a0d-8cde-a8a5c528c7c0.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 5,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/747d21ba-ee74-4a6d-a3eb-02074de1adb1.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test测试Test测试Test测试Test测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 6,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/cb4ef07a-a2b1-4a0d-8cde-a8a5c528c7c0.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 7,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/747d21ba-ee74-4a6d-a3eb-02074de1adb1.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test测试Test测试Test测试Test测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 8,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/747d21ba-ee74-4a6d-a3eb-02074de1adb1.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test测试Test测试Test测试Test测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 9,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/cb4ef07a-a2b1-4a0d-8cde-a8a5c528c7c0.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 10,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/747d21ba-ee74-4a6d-a3eb-02074de1adb1.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test测试Test测试Test测试Test测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 11,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/cb4ef07a-a2b1-4a0d-8cde-a8a5c528c7c0.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 12,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/747d21ba-ee74-4a6d-a3eb-02074de1adb1.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test测试Test测试Test测试Test测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // },
        // {
        //   id: 13,
        //   image: 'https://distance0.oss-cn-chengdu.aliyuncs.com/music/cb4ef07a-a2b1-4a0d-8cde-a8a5c528c7c0.jpg',
        //   username: '宇多田',
        //   userId: 1,
        //   articleId: 1,
        //   title: '测试Test',
        //   likeCount: 153,
        //   replyCount: 45,
        //   createTime: '2024-12-1',
        //   browse: 201
        // }
      ],
      categoryId: 1
    }
  },
  methods: {
    imgLocation (parent, content) {
      const cparent = document.querySelector(parent)
      const ccontent = document.querySelectorAll(content)

      console.log(ccontent)
      const imgWidth = ccontent[0].offsetWidth
      console.log('小盒子宽度' + imgWidth)

      const num = Math.floor(cparent.clientWidth / imgWidth)
      console.log('大盒子宽度' + cparent.clientWidth)
      cparent.style.width = `${imgWidth * num}px`

      console.log('页面一行能存放图片的张数' + num)
      const BoxHeightArr = []
      for (let i = 0; i < ccontent.length; i++) {
        if (i < num) {
          // 先将第一行放满
          ccontent[i].style.position = 'absolute'
          ccontent[i].style.top = '40px'
          ccontent[i].style.left = (i * imgWidth + 40) + 'px'
          // console.log(i * imgWidth)
          BoxHeightArr[i] = ccontent[i].offsetHeight + 40
        } else {
          const minHeight = Math.min.apply(null, BoxHeightArr)
          const minIndex = BoxHeightArr.indexOf(minHeight)

          ccontent[i].style.position = 'absolute'

          ccontent[i].style.top = (minHeight + 20) + 'px'

          ccontent[i].style.left = ccontent[minIndex].offsetLeft + 'px'

          BoxHeightArr[minIndex] = BoxHeightArr[minIndex] + ccontent[i].offsetHeight + 40
        }
      }
    },
    async getArticle (categoryId) {
      this.categoryId = categoryId
      const { data } = await getArticleByCategoryId({ categoryId })
      this.items = data
      this.$nextTick(() => {
        this.imgLocation('.content', '.articleItem')
      })
    }
  },
  mounted () {
  },
  created () {
    this.getArticle(this.categoryId)
  }
}
</script>

<template>
  <div class="community" v-title data-title="社区">
    <div class="content">
      <ArticleItem v-for="item in items" :key="item.id" :article="item"/>
    </div>
    <div class="navigation-bar">
      <div class="category">
        <ul>
          <li class="nav-public"
              @click="getArticle(item.id)"
              v-for="item in categoryMock" :key="item.id"
              :class="{ active: categoryId === item.id }"
          >
            <i class="iconfont icon-biaoqian"></i>
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="action" :style="{
        marginBottom : (this.$route.path === '/404' || this.$route.path === '/login')
        ||   this.$store.state.player.isPlay
         ? '80px' : ''
      }">
        <div class="issue nav-public" @click="() => $router.push('/editor')">
          <i class="iconfont icon-yongyan"></i>
          写文章
        </div>
        <div class="draft nav-public">
          <i class="iconfont icon-wendang-caogao-F"></i>
          草稿箱
        </div>
      </div>
    </div>
    <el-backtop :visibility-height="100"/>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/index";

.community {
  min-height: calc(100vh - $footer);
  display: flex;
  position: relative;
  .content {
    width: calc(100vw - 11rem - 250px);
    height: 100%;
    position: relative;
  }
  .navigation-bar {
    min-width: 11rem;
    height: 100%;
    position: fixed;
    right: 0;
    background-color: var(--aside-background-color);
    border-width: 0 0 0 0.0625rem;
    border-left-color: var(--border-color);
    border-style: solid;
    display: flex;
    flex-direction: column;
    .category {
      padding-top: 50px;
    }
    .action {
      margin-top: auto;
      .issue {
      }
      .draft {
      }
    }
    .active{
      //background-color: var(--aside-background-color);
      background-color: #409EFF;
    }
    .nav-public {
      padding: 12px 17px 12px 0;
      font-size: 1rem;
      color: #FFFFFF;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      transition: all .1s linear;
      margin: 3px;
      i {
        margin: 0 8px;
      }
      &:hover {
        background-color: var(--active-bg);
      }
    }
  }
}
</style>
