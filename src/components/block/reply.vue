<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import replyInput from '@/components/block/replyInput.vue'

export default {
  name: 'replyBlock',
  components: { replyInput },
  props: {
    item: {}
  },
  data () {
    return {
      // children: { ...this.item.children },
      isInput: false,
      showPage: false,
      // total: 0,
      pagination: {
        pageSize: 10,
        page: 1
      },
      islike: false
      // islikeChild: false
    }
  },
  methods: {
    ...mapActions('comment', ['updateCommentProperty', 'clear']),
    ...mapMutations('comment', ['setRootId', 'setActionUserId', 'setActionUserName', 'setParent']),
    // 回复父评论
    async reply () {
      await this.clear()
      this.setRootId(this.item.id)
      this.setActionUserId(this.item.userId)
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
      this.$emit('more', {
        pagination: this.pagination,
        objId: this.item.objId,
        objType: this.item.objType,
        rootId: this.item.id
      })
      this.showPage = true
    },
    currentChange (e) {
      this.pagination.page = e
      this.moreComment()
    },
    onLike (type, reload) {
      if (type === 1) {
        this.$emit('like', {
          objId: this.item.id,
          objUserId: this.item.userInfo.id
        })
        reload.islike = true
      }
      if (type === 2) {
        this.$emit('like', {
          objId: reload.id,
          objUserId: reload.userInfo.id
        })
        reload.islike = true
      }
    },
    // 取消点赞
    unLike (type, reload) {
      if (type === 1) {
        this.$emit('unlike', { objId: this.item.id, objUserId: this.item.userInfo.id })
        reload.islike = false
      }
      if (type === 2) {
        this.$emit('unlike', { objId: reload.id, objUserId: reload.userInfo.id })
        reload.islike = false
      }
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
        <el-avatar :src="item.userInfo?.avatar" />
      </div>
      <div class="context">
        <span class="user-name" @click="$router.push(`/user/${item.userInfo.id}`)">{{ item.userInfo?.name }}</span>
        <div class="root-reply">
          <div class="reply-content">{{ item.content }}</div>
          <div class="reply-info">
            <span class="reply-time">{{ item.createTime }}</span>
            <span class="reply-like" :class="{ like:  item.islike}">
              <i v-if="!item.islike" @click="onLike(1, item)" class="iconfont icon-dianzan2-copy" />
              <i v-else @click="unLike(1, item)" class="iconfont icon-dianzan-copy" />
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
      <div class="child-item" style="display: flex;" v-for="children in item.children" :key="'children' + children.id" >
        <div class="avatar" @click="$router.push(`/user/${children.userInfo.id}`)">
          <el-avatar size="small" :src="children.userInfo?.avatar" />
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
              <i v-if="!children.islike" @click="onLike(2, children)" class="iconfont icon-dianzan2-copy" />
              <i v-else @click="unLike(2, children)" class="iconfont icon-dianzan-copy"/>
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
          layout="pager"
          background
          v-else
          :small="true"
          :hide-on-single-page="true"
          :total="item.num"
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
        //color: #61666d;
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
          //color: #9499A0;
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
            //color: #61666d;
            margin-right: 10px;
            cursor: pointer;
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
