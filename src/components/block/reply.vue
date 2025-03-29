<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import replyInput from '@/components/block/replyInput.vue'
// import debounce from 'lodash/debounce'
import { moreComment } from '@/api/comment'

export default {
  name: 'replyBlock',
  components: { replyInput },
  props: {
    item: {},
    objId: Number,
    objType: Number
  },
  data () {
    return {
      isInput: false,
      showPage: false,
      pagination: {
        pageSize: 5,
        page: 1
      },
      islike: false,
      child: [],
      total: 0
    }
  },
  methods: {
    ...mapActions('comment', ['updateCommentProperty', 'clear']),
    ...mapMutations('common', ['setFocus', 'setIsFocus']),
    ...mapMutations('comment', ['setRootId', 'setActionUserId', 'setActionUserName', 'setParent']),
    // 回复父评论
    async reply () {
      await this.clear()
      this.setRootId(this.item.id)
      this.setParent(this.item.id)
      this.setActionUserName(this.item.userInfo.name)
      this.isInput = true
    },
    // 回复子评论
    async childReply (e) {
      await this.clear()
      this.setRootId(this.item.id)
      this.setActionUserId(e.userId)
      this.setParent(e.id)
      this.setActionUserName(e.userInfo.name)
      this.isInput = true
    },
    // 提交评论
    submit (data) {
      this.$emit('submit', data)
    },
    // 更多评论
    async moreComment () {
      const { data } = await moreComment({ ...this.pagination, objId: this.objId, objType: this.objType, rootId: this.item.id })
      this.child = [...data.page]
      this.total = data.total
      // const find = this.reply.find(item => item.id === rootId)
      // if (find) { find.children = data.page }
      // this.$emit('more', {
      //   pagination: this.pagination,
      //   objId: this.objId,
      //   objType: this.objType,
      //   rootId: this.item.id
      // })
      this.showPage = true
    },
    currentChange (e) {
      this.pagination.page = e
      this.moreComment()
    },
    onLike (reload) {
      this.$emit('like', {
        objId: reload.id,
        objUserId: reload.userInfo.id
      })
      reload.islike = true
      reload.likeCount += 1
    },
    // 取消点赞
    unLike (reload) {
      this.$emit('unlike', {
        objId: reload.id,
        objUserId: reload.userInfo.id
      })
      reload.islike = false
      reload.likeCount -= 1
    },
    // 聚焦头像
    focusAvatar (userInfo, event) {
      // 获取事件目标（头像元素）
      const avatarElement = event.target
      // 获取头像元素的位置信息
      const rect = avatarElement.getBoundingClientRect()
      // 视口尺寸检测
      const viewportHeight = window.innerHeight
      const floatBoxWidth = 150

      // 计算头像上方的位置
      const x = rect.left // 头像中心的水平位置
      // const y = rect.top - floatBoxWidth // 头像顶部的位置

      // 智能方向判断
      let y
      if (rect.top - floatBoxWidth > 0) { // 上方空间充足
        y = rect.top - floatBoxWidth // 上方显示（原位置）
      } else if (viewportHeight - rect.bottom > floatBoxWidth) { // 下方空间充足
        y = rect.bottom // 下方显示
      } else { // 上下都不足时贴底显示
        y = viewportHeight - floatBoxWidth
      }

      // 调用方法设置聚焦效果
      this.setFocus({ userInfo, x: x, y: y }) // 偏移 10px 让其更自然
      this.setIsFocus(true)
    },
    // 是否聚焦
    isFocus () {
      this.setIsFocus(false)
    }
  },
  computed: {
    ...mapGetters('comment', ['getCommentProperty']),
    ...mapState('comment', ['rootId']),
    ...mapState('user', ['userInfo'])
  }
}
</script>

<template>
  <div class="reply">
    <div class="main" style="display: flex;">
      <div class="avatar" @click="$router.push(`/user/${ item.userInfo.id }`)">
        <el-avatar :src="item.userInfo?.avatar"
                   @mouseenter.native="focusAvatar(item.userInfo, $event)"
                   @mouseleave.native="isFocus"
        >
        </el-avatar>
      </div>
      <div class="context">
        <span class="user-name" @click="$router.push(`/user/${item.userInfo.id}`)">{{ item.userInfo?.name }}</span>
        <div class="root-reply">
          <div class="reply-content">{{ item.content }}</div>
          <div class="reply-info">
            <span class="reply-time">{{ item.createTime }}</span>
            <span class="reply-like" :class="{ like:  item.islike}">
              <i v-if="!item.islike" @click="onLike(item)" class="iconfont icon-dianzan2-copy" />
              <i v-else @click="unLike(item)" class="iconfont icon-dianzan-copy" />
<!--              {{ item.islike ? item.likeCount + 1 : item.likeCount}}-->
              {{ item.likeCount }}
            </span>
            <span style="transform: rotateX(180deg);">
              <i class="iconfont icon-dianzan2-copy"></i>
            </span>
            <span class="reply-btn" @click="reply">回复</span>
          </div>
        </div>
      </div>
    </div>
    <div class="child">
      <div class="child-item" style="display: flex;" v-for="children in child" :key="children.id" >
        <div class="avatar" @click="$router.push(`/user/${children.userInfo.id}`)">
          <el-avatar size="small" :src="children.userInfo?.avatar"
                     @mouseenter.native="focusAvatar(children.userInfo, $event)"
                     @mouseleave.native="isFocus"
          >
          </el-avatar>
        </div>
        <div class="context">
          <div class="reply-content">
          <span
            class="user-name"
            @click="$router.push(`/user/${children.userInfo?.id}`)"
          >
            {{ children.userInfo?.name }}
          </span>
          <span v-if="children.replyToUser" style="color: var(--text-color)">
            回复
            <i style="color: #409EFF; margin-right: 10px" @click="$router.push(`/user/${children.replyToUser.id}`)">
              @{{ children.replyToUser?.name }}
            </i>
          </span>
            <span class="children-content">: {{ children.content }}</span>
          </div>
          <div class="reply-info">
            <span class="reply-time">{{ children.createTime }}</span>
            <span class="reply-like" :class="{ like:  children.islike}">
              <i v-if="!children.islike" @click="onLike(children)" class="iconfont icon-dianzan2-copy" />
              <i v-else @click="unLike(children)" class="iconfont icon-dianzan-copy"/>
<!--              {{ children.islike ? children.likeCount + 1 : children.likeCount }}-->
              {{ children.likeCount }}
            </span>
            <span style="transform: rotateX(180deg);">
              <i class="iconfont icon-dianzan2-copy" />
            </span>
            <span class="reply-btn" @click="childReply(children)">回复</span>
          </div>
        </div>
      </div>
      <div class="more">
        <div v-if="!showPage && this.item.num > 3">共{{ this.item.num }}条回复，<i @click="moreComment">点击查看</i></div>
        <el-pagination
          layout="prev, pager, next"
          v-else
          :page-size="5"
          :small="true"
          :hide-on-single-page="true"
          :total="total"
          @current-change="currentChange"
        />
      </div>
    </div>
    <transition name="fade">
      <replyInput v-if="isInput && rootId === item.id" @sub="submit"></replyInput>
    </transition>
<!--    <el-divider />-->
  </div>
</template>

<style scoped lang="scss">
.like{ color: #409EFF; }

.reply{
  position: relative;
  min-height: 90px;
  .main{
    .avatar{
    }
    .context{
      margin: 3px 0 0 10px;
      .user-name{
        cursor: pointer;
        font-size: 15px;
        color: var(--text-color);
        &:hover{
          text-decoration: underline;
        }
      }
      .root-reply{
        margin-top: 15px;
        white-space: pre-wrap;
        .reply-content{
          color: var(--text-color);
          word-wrap: break-word;
          height: 100%;
          min-width: 800px;
        }
        .reply-info{
          color: var(--text-color);
          display: flex;
          align-items: center;
          font-size: 13px;
          margin-top: 10px;
          .reply-btn{
            &:hover{
              color: #409EFF;
            }
          }
        }
        .reply-info span{
          margin-right: 20px;
          &:hover{
            fill: #409EFF;
          }
        }
      }
    }
  }
  .child{
    padding: 20px 0 0 50px;
    .child-item{
      margin-bottom: 20px;
      .context{
        margin: 3px 0 0 10px;
        .reply-content{
          display: flex;
          align-items: center;
          .user-name{
            font-size: 15px;
            color: var(--text-color);
            margin-right: 10px;
            cursor: pointer;
            &:hover{
              text-decoration: underline;
            }
          }
          .children-content{
            color: var(--text-color);
            cursor: auto;
            font-size: 14px;
          }
        }
      }
      .reply-info{
        color: var(--text-color);
        //color: #9499A0;
        font-size: 13px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        .reply-btn{
          &:hover{
            color: #409EFF;
          }
        }
      }
      .reply-info span{
        margin-right: 20px;
        &:hover{
          fill: #409EFF;
        }
      }
    }
    .more{
      color: #9499a0;
      font-size: 13px;
      margin-bottom: 20px;
      i:hover{
        color: #409EFF;
      }
      ::v-deep .el-pagination{
        .btn-prev, .btn-next{
          background: transparent;
        }
        .el-pager li{
          background: transparent;
        }
      }
    }
  }
  .el-divider{
    width: 900px;
    margin: 20px 10px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all .3s ease;
}
.fade-enter, .fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
