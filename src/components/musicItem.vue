<script>
export default {
  name: 'musicItem',
  props: {
    music: Object,
    index: Number
  }
}
</script>

<template>
  <div class="musicItem">
    <div class="music-index public">
      <div class="public">
        <span class="index">
          {{index}}
        </span>
        <button class="player">
          <svg t="1715863851135" class="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="4289" width="15" height="15"><path
            d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z"
            p-id="4290"></path></svg>
        </button>
      </div>
    </div>
    <div class="music-info public">
      <el-image :src="music.albumImage" alt="" style="width: 40px; height: 40px;" class="img"></el-image>
      <a href="">{{music.name}}</a>
    </div>
    <div class="music-num public">
      <div class="num">
        {{music.count}}
      </div>
    </div>
    <div class="music-more public">
      <div class="duration">
        4:21
      </div>
      <div class="more">
        <span>
          <svg t="1716099706353" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2625" width="15" height="15"><path d="M96 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z" p-id="2626"></path><path d="M512 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z" p-id="2627"></path><path d="M928 512m-96 0a3 3 0 1 0 192 0 3 3 0 1 0-192 0Z" p-id="2628"></path></svg>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@media (hover: hover) {
  .musicItem:hover {
    background-color: rgba(212, 212, 212, 0.4);
    border-radius: 5px;
    transition: background-color .2s;
    opacity: 1;
  }
  .musicItem:hover .music-index .public .player{
    opacity: 1;
  }
  .musicItem:hover .music-index .public .index{
    opacity: 0;
  }
  .musicItem:hover .music-more .more{
    opacity: 1;
    transition: opacity .2s;
  }
}

.musicItem{
  //width: 100%;
  padding: 8px;
  display: grid;
  grid-template-columns: 3rem 22rem 120px 110px;
  .public{
    display: flex;
    align-items: center;
  }
  .music-index{
    padding: 0px 15px;
    //justify-self: end;
    .player{
      background-color: #FFFFFF00;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      opacity: 0;
    }
    .index{
      pointer-events: none;
      position: absolute;
    }
  }
  .music-info{
    margin-left: 10px;
    //padding-right: 15rem;
    .img{
      border-radius: 5px;
      margin-right: 10px;
    }
    a{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .music-num{
    text-align: right;
    .num{
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
  }
  .music-more{
    justify-content: right;
    margin-right: 10px;
    .duration{
      margin-right: 10px;
    }
    .more{
      opacity: 0;
    }
  }
}
</style>
