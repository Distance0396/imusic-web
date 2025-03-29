<script>
import ArticleItem from '@/components/block/ArticleItem.vue'
import { getArticleByCategoryId } from '@/api/article'

export default {
  name: 'communityIndex',
  components: {
    ArticleItem,
  },
  data() {
    return {
      restaurants: [],
      categoryMock: [
        {
          id: 1,
          name: '流行',
        },
        {
          id: 2,
          name: '摇滚',
        },
        {
          id: 3,
          name: 'R&B',
        },
        {
          id: 4,
          name: '电子',
        },
        {
          id: 5,
          name: '民谣',
        },
      ],
      items: [],
      categoryId: 1,
      sortType: 'time',
      id: 0,
      waterfallContainerDom: '', // 瀑布容器 DOM
      containerDom: '', // 容器 DOM
      getTextLineHeightCtx: '', // 获取文本行高 ctx
      gap: 16, // 差距
      columnWidth: 0, // 列宽
      domDataList: [], // DOM 数据列表
      positionList: [], // 位置列表
      screenOffset: '', // 偏移量
      renderMap: {}, // 渲染贴图
      resizeCallback: null, // resize 回调
      lastOffsetWidth: '', // 上次偏移宽度
      lastScrollNumY: 0, // 上次滚动距离Y
      lastScrollNumX: 0, // 上次滚动距离X
      scrollDirection: 1, // 上次滚动方向 向下 为 1，向上为 -1
    }
  },
  methods: {
    async getArticle(categoryId = 1) {
      this.categoryId = categoryId
      const { data } = await getArticleByCategoryId({
        categoryId: categoryId,
        sortType: this.sortType,
        id: this.id,
      })
      this.items = data
      this.$nextTick(() => {
        // this.imgLocation('.content', '.articleItem')
      })
    },
    // 根据容器宽度获取显示列数（自由发挥）
    getColumnNum(boxWidth) {
      if (boxWidth >= 1600) return 5
      else if (boxWidth >= 1200) return 4
      else if (boxWidth >= 768 && boxWidth < 1200) return 3
      else return 2
    },
    // 计算列宽
    computeColumnWidth() {
      const columnNum = this.getColumnNum(this.waterfallContainerDom.innerWidth)
      const allGapLength = this.gap * (columnNum - 1) // 所有间隙长度
      this.columnWidth =
        (this.containerDom.offsetWidth - allGapLength) / columnNum // 列宽
    },
    // 重置瀑布流每一列数据
    initPositionList() {
      this.positionList = []
      // 首先计算应呈现的列数
      for (
        let i = 0;
        i < this.getColumnNum(this.waterfallContainerDom.innerWidth);
        i++
      ) {
        this.positionList.push({
          columnIdx: i + 1,
          columnHeight: 0,
        })
      }
    },
    async getDataRender() {
      this.computeDomData(await this.getArticle(), 0)
    },
    // 计算数据形成 排序表
    computeDomData(list, startRenderIdx = 0) {
      const tempDomDataList = []
      for (let i = 0; i < list.length; i++) {
        const param = {
          idx: startRenderIdx + i,
          img: this.imgList[Math.trunc(Math.random() * 3)],
          columnIdx: 0,
          width: this.columnWidth,
          height: (list[i].h * this.columnWidth) / list[i].w,
          left: 0,
          top: 0,
          text: this.testList[Math.trunc(Math.random() * 3)],
          lineHeight: 74, // 根据css设置的值计算得到
        }
        // 排序，第一项必定是长度最短的一列
        this.positionList.sort((a, b) => a.columnHeight - b.columnHeight)
        param.columnIdx = this.positionList[0].columnIdx
        param.left = (param.columnIdx - 1) * (this.gap + this.columnWidth)

        param.top = this.positionList[0].columnHeight

        const canvas = document.createElement('canvas')
        this.getTextLineHeightCtx = canvas.getContext('2d')
        this.getTextLineHeightCtx.font = '16px sans-serif'
        // css 样式表设置了 纵坐标的12px内边距，要加上
        param.lineHeight =
          this.getTextLineHeightCtx.measureText(param.text).width + 24 >
          this.columnWidth
            ? 98
            : 78

        param.height += param.lineHeight
        this.positionList[0].columnHeight += param.height + this.gap
        tempDomDataList.push(param)
      }
      this.domDataList = this.domDataList.concat(tempDomDataList)

      // 设置容器高度
      this.positionList.sort((a, b) => a.columnHeight - b.columnHeight)
      this.containerDom.style.height =
        this.positionList[this.positionList.length - 1].columnHeight + 32 + 'px'
    },
    // 根据元素列表进行渲染
    renderDomByDomDataList(startRenderIdx = 0) {
      if (!this.domDataList.length) return
      const tempRenderMap = {}
      let topIdx = startRenderIdx
      let bottomIdx = startRenderIdx

      // 处于这两条线之间的元素将被渲染进容器
      for (let i = startRenderIdx; i < this.domDataList.length; i++) {
        const { idx } = this.domDataList[i]
        const { overTopLine, underBottomLine } = this.checkIsRender(
          this.domDataList[i]
        )
        const dom = this.containerDom.querySelector(`#item_${idx}`)
        if (overTopLine || underBottomLine) {
          dom?.remove()
          continue
        }
        topIdx = topIdx < idx ? topIdx : idx
        bottomIdx = bottomIdx < idx ? idx : bottomIdx

        if (dom) {
          tempRenderMap[idx] = this.createDom(dom, this.domDataList[i])
        } else {
          tempRenderMap[idx] = this.createDom(
            document.createElement('div'),
            this.domDataList[i]
          )
          this.containerDom.append(tempRenderMap[idx])
        }
      }
      const keys = Object.keys(Object.assign(this.renderMap, tempRenderMap))
      this.startIdx = +keys[0]
      this.endIdx = +keys[keys.length - 1]
    },
    // 计算元素是否符合渲染条件
    checkIsRender(params) {
      const { top, height } = params
      const y = top + height + this.containerTop
      // 1个视口的数据再快速滚动滚动条时大概率会有加载项，不妨扩大到上下各0.5个视口，共2个视口内的数据，这样就比较丝滑了，这里也是自由发挥
      const topLine = this.waterfallContainerDom.scrollTop - this.screenOffset
      const bottomLine =
        this.waterfallContainerDom.scrollTop +
        this.waterfallContainerDom.offsetHeight +
        this.screenOffset
      // 是否在上线之上
      const overTopLine = topLine > y
      // 是否在下线之下
      const underBottomLine = top > bottomLine
      return {
        overTopLine,
        underBottomLine,
      }
    },
    // 创建瀑布流每一项  dom元素
    createDom(dom, param) {
      dom.classList.add('waterfall-item')
      dom.style.width = param.width + 'px'
      dom.style.height = param.height + 'px'
      dom.style.transform = `translate(${param.left}px, ${param.top}px)`
      dom.id = `item_${param.idx}`
      // <div class="main">${param.idx}</div>
      // <div class="main">${param.idx}</div>
      dom.innerHTML = `
              <image class="main" src="${param.img}" alt=""/>
              <div class="footer" style="height: ${param.lineHeight}px">
                <div class="text">${param.idx}--${param.text}</div>
                <div class="info">@脆脆土豆条 -《蜡笔小新》</div>
              </div>`
      return dom
    },
  },
  mounted() {
    this.waterfallContainerDom = document.querySelector('.community')
    this.screenOffset = this.waterfallContainerDom.offsetHeight / 2
    this.containerDom = document.querySelector('.content')
    // this.loadingDom = document.querySelector('.loading')
    // this.gotoTopDom = document.querySelector('.to-top')
    this.lastOffsetWidth = window.innerWidth
    this.waterfallContainerDom.addEventListener('scroll', () => {
      // 添加滚动事件监听器
      console.log('滚动事件触发')
      this.handleScroll()
    })
    window.addEventListener('resize', () => {
      // 添加滚动事件监听器
      console.log('视窗大小变化')
      this.resize()
    })
    this.computeColumnWidth()
    this.initPositionList()
    this.getDataRender()
  },
}
</script>

<template>
  <div class="community" v-title data-title="社区">
    <div class="content" ref="content">
      <ArticleItem v-for="item in items" :key="item.id" :article="item" />
    </div>
    <div class="navigation-bar">
      <div class="category">
        <ul>
          <li
            class="nav-public"
            @click="getArticle(item.id)"
            v-for="item in categoryMock"
            :key="item.id"
            :class="{
              active: categoryId === item.id,
            }"
          >
            <i class="iconfont icon-biaoqian"></i>
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div
        class="action"
        :style="{
          marginBottom:
            this.$route.path === '/404' ||
            this.$route.path === '/login' ||
            this.$store.state.player.isPlay
              ? '80px'
              : '',
        }"
      >
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
    <el-backtop :visibility-height="100" />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/index';

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
    .active {
      //background-color: var(--aside-background-color);
      background-color: #409eff;
    }
    .nav-public {
      padding: 12px 17px 12px 0;
      font-size: 1rem;
      color: #ffffff;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.1s linear;
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
