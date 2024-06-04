<script>
export default {
  name: 'scrollBar',
  data () {
    return {
      num: 0,
      // 单个宽度
      itemWidth: 0,
      // 总宽度
      scrollBarItemWidth: 0,
      // 可滑动距离
      maxTranslate: 0
    }
  },
  created () {

  },
  mounted () {
    this.updateDimensions()
  },

  methods: {
    updateDimensions () {
      // 获取整个滚动条的宽度
      this.scrollBarItemWidth = this.$refs.scrollBarItem.clientWidth

      // 获取所有item
      const items = this.$refs.item.children

      // 不为空就获取item宽度
      if (items.length > 0) {
        this.itemWidth = items[0].clientWidth
      }
      // 计算可滑动距离
      this.maxTranslate = Math.max(0, items.length * this.itemWidth - this.scrollBarItemWidth)
      console.log(this.maxTranslate)
    },
    rollingLeft () {
      this.updateDimensions()
      if (this.num <= 0) return
      this.num = Math.max(0, this.num - this.itemWidth)
      this.$refs.item.style.transform = 'translateX(-' + this.num + 'px)'
    },
    rollingRight () {
      this.updateDimensions()
      if (this.num >= this.maxTranslate) return
      this.num = Math.min(this.maxTranslate, this.num + this.itemWidth)
      this.$refs.item.style.transform = 'translateX(-' + this.num + 'px)'
    }
  }
}
</script>

<template>
  <div class="scroll-bar">
    <div class="scroll-bar-navbar">
      <slot name="title"></slot>
      <div class="scroll-bar-btn">
        <span class="rolling-left rolling" @click="rollingLeft">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                 width="15" height="15"><path
              d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"
              fill="#000000" ></path>
            </svg>
          </span>
        <span class="rolling-right rolling" @click="rollingRight">
            <svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                 width="15" height="15"><path
              d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"
              fill="#000000" ></path>
            </svg>
        </span>
      </div>
    </div>
    <div class="scroll-bar-item" ref="scrollBarItem">
      <div class="item" ref="item">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

.scroll-bar-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  i {
    font-size: 2rem;
  }

  .scroll-bar-btn {
    display: inline-flex;
    flex-wrap: nowrap;
    margin-left: auto;
    .rolling {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: rgb(229, 230, 235);
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 50%;
    }

    span:nth-child(2) {
      svg {
        transform: rotate(180deg);
      }
    }
  }
}

.scroll-bar-item {
  display: flex;
  flex-wrap: nowrap;
  scrollbar-width: none;
  align-items: center;
  margin-top: 10px;
  //overflow: hidden;
  contain: paint;
  .item {
    display: inline-flex;
    flex-wrap: nowrap;
    transition: transform 0.4s ease;
  }
}
</style>
