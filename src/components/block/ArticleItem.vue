<script>
export default {
  name: 'articleItem',
  props: {
    article: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<template>
  <div
    class="articleItem"
    @click.stop="() => $router.push(`/article/${article.id}`)"
  >
    <div class="article-Image">
      <img
        style="width: 100%; height: 100%; object-fit: cover"
        :src="article?.face"
        alt=""
      />
      <!--    <el-image :src="article.image" />-->
    </div>
    <div class="article-Info">
      <div class="title">{{ article?.title }}</div>
      <div class="info">
        <div
          class="author"
          @click="() => $router.push(`/user/${article?.user.id}`)"
        >
          {{ article?.user?.name }}
        </div>
        <!--      <div class="time" style="margin-right: 20px;">发布于:{{article.createTime}}</div>-->
        <!--      <div class="browse">{{article.browse}}浏览</div>-->
        <!--      <div class="like">{{article?.likeCount}}点赞</div>-->
        <div class="browse">{{ article?.commentCount }}条评论</div>
      </div>
    </div>
    <!--  <div class="article-Image">-->
    <!--    <img :src="article.image" alt="">-->
    <!--&lt;!&ndash;    <el-image :src="article.image" />&ndash;&gt;-->
    <!--  </div>-->
  </div>
</template>

<style scoped lang="scss">
.articleItem {
  min-width: 250px;
  width: 250px;
  display: flex;
  box-shadow: var(--article-hover-border);
  transition: all 0.1s ease-out;
  cursor: pointer;
  flex-direction: column;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 8px;
  border: 0.0625rem solid var(--border-color);
  &:hover {
    background-color: var(--article-hover-bg);
  }
  .article-Image {
    //margin-left: auto;
    height: 100%;
    min-width: 250px;
    width: 250px;
    border-radius: 8px;
    overflow: hidden;
  }
  .article-Info {
    //width: 30vw;
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    width: 100%;
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--text-color);
      font-size: 18px;
    }
    .info {
      color: rgb(170, 170, 170);
      //color: var(--info-text);
      display: flex;
      align-items: center;
      margin-top: auto;
      > div {
        //margin-right: 10px;
      }
      .browse {
        margin-left: auto;
      }
      .author {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

//.articleItem{
//  width: 100%;
//  //min-width: 570px;
//  min-width: 300px;
//  display: flex;
//  min-height: 100px;
//  padding: 20px 40px 20px 20px;
//  //margin: 10px;
//  //background-color: var(--main-background-color);
//  background-color: rgb(29, 29, 29);
//  border-radius: 3px;
//  box-shadow: var(--article-hover-border);
//  transition: all .1s ease-out;
//  cursor: pointer;
//  white-space: nowrap;
//  &:hover{
//    background-color: var(--article-hover-bg);
//  }
//  .article-Image{
//    //margin-left: auto;
//    height: 150px;
//    width: 200px;
//    min-width: 200px;
//    border-radius: 4px;
//    overflow: hidden;
//  }
//  .article-Info{
//    width: 30vw;
//    display: flex;
//    flex-direction: column;
//    .title{
//      color: var(--text-color);
//      font-size: 45px;
//    }
//    .info{
//      color: rgb(170, 170, 170);;
//      //color: var(--info-text);
//      display: flex;
//      align-items: center;
//      margin-top: auto;
//      > div{
//        margin-right: 10px;
//      }
//      .author{
//        &:hover{
//          text-decoration: underline;
//        }
//      }
//    }
//  }
//  //.article-Image{
//  //  margin-left: auto;
//  //  height: 150px;
//  //  width: 200px;
//  //  min-width: 200px;
//  //  border-radius: 4px;
//  //  overflow: hidden;
//  //}
//}
</style>
