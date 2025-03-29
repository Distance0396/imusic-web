<template>
  <div class="container">
    <div class="water-fall-container">
      <div class="box">
        <div class="loading">加载中...</div>
      </div>
    </div>
    <div class="to-top" @click="onclick">↑</div>
  </div>
</template>
<script>
import WHList from './data'
import debounce from 'lodash/debounce'
import { throttle } from 'lodash/function'
export default {
  name: 'WaterfallVirtual',
  data() {
    return {
      waterfallContainerDom: '',
      containerDom: '',
      loadingDom: '',
      canvas: '',
      getTextLineHeightCtx: '',
      list: [],
      page: 1,
      pageSize: 50,
      hasNextPage: true,
      gap: 16,
      columnWidth: 0,
      containerTop: 0,
      domDataList: [],
      positionList: [],
      renderMap: {},
      startIdx: 0,
      endIdx: 0,
      screenOffset: '', // 偏移量
      isLoadNextPage: false, // 是否加载下一页数据
      testList: [
        '《蜡笔小新》是一部于1992年出品的日本家庭搞笑动画片，该片主要由本乡满、原惠一、武藤裕治导演，日本朝日电视台于1992年4月13日播映了第一集。至今仍在播出。',
        '看过蜡笔小新的人，都知道，他有一个很逗的老爸——野原广志。 这位胡须浓密、面条脸的野原广志先生是一名普通的上班族，在车上享受着和周围女子相互挤攘的感觉（偶尔旁边是大叔也很囧）。',
        '脚臭的广志,小气的美伢,淘气的小新……',
      ],
      imgList: [
        'https://img2.baidu.com/it/u=3600821550,221281285&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500',
        'https://img0.baidu.com/it/u=2506471502,1373494428&fm=253&fmt=auto&app=120&f=JPEG?w=530&h=500',
        'https://img2.baidu.com/it/u=824566914,3863846826&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500',
      ],
      resizeCallback: null,
      lastOffsetWidth: '',
      lastScrollNumY: 0, // 上次滚动距离Y
      lastScrollNumX: 0, // 上次滚动距离X
      scrollDirection: 1, // 上次滚动方向 向下 为 1，向上为 -1
    }
  },
  methods: {
    // 获取数据
    getList() {
      return new Promise(resolve => {
        const start = (this.page - 1) * this.pageSize
        const nextList = WHList.slice(start, start + this.pageSize)
        this.hasNextPage = !!nextList.length
        this.list = this.page === 1 ? nextList : this.list.concat(nextList)
        setTimeout(
          () => {
            resolve(nextList)
          },
          this.page === 1 ? 0 : 2000
        ) // 模拟发送请求
      })
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
    // 根据容器宽度获取显示列数（自由发挥）
    getColumnNum(boxWidth) {
      if (boxWidth >= 1600) return 5
      else if (boxWidth >= 1200) return 4
      else if (boxWidth >= 768 && boxWidth < 1200) return 3
      else return 2
    },
    // 1计算瀑布流每一列列宽
    computeColumnWidth() {
      // 首先计算应呈现的列数
      const columnNum = this.getColumnNum(window.innerWidth)
      const allGapLength = this.gap * (columnNum - 1)
      this.columnWidth =
        (this.containerDom.offsetWidth - allGapLength) / columnNum
    },
    // 2重置瀑布流每一列数据
    initPositionList() {
      this.positionList = []
      // 首先计算应呈现的列数
      for (let i = 0; i < this.getColumnNum(window.innerWidth); i++) {
        this.positionList.push({
          columnIdx: i + 1,
          columnHeight: 0,
        })
      }
    },
    // 当滚动条滚动时，更新容器内的 每一项 元素是 插入 还是 删除
    updateDomPosition(direction = 1) {
      const tempRenderMap = {}
      console.log(this, 'updateDomPosition', this.endIdx)
      for (let i = this.startIdx; i <= this.endIdx; i++) {
        // 检查已渲染列表中的元素，不符合条件删除元素，反之插入元素
        if (!this.domDataList[i]) return
        const { overTopLine, underBottomLine } = this.checkIsRender(
          this.domDataList[i]
        )
        if (overTopLine || underBottomLine) {
          this.renderMap[i]?.remove()
        } else if (this.renderMap[i]) {
          tempRenderMap[i] = this.renderMap[i]
        } else {
          tempRenderMap[i] = this.createDom(
            document.createElement('div'),
            this.domDataList[i]
          )
          this.containerDom.append(tempRenderMap[i])
        }
      }
      // 向上
      if (direction < 0) {
        for (let i = this.startIdx - 1; i >= 0; i--) {
          const { overTopLine } = this.checkIsRender(this.domDataList[i])
          if (overTopLine) break
          tempRenderMap[i] = this.createDom(
            document.createElement('div'),
            this.domDataList[i]
          )
          this.containerDom.append(tempRenderMap[i])
        }
      } else {
        // 向下
        for (let i = this.endIdx + 1; i < this.domDataList.length; i++) {
          const { underBottomLine } = this.checkIsRender(this.domDataList[i])
          // 只要找到Bottom在下线之下的立即停止
          if (underBottomLine) break
          tempRenderMap[i] = this.createDom(
            document.createElement('div'),
            this.domDataList[i]
          )
          this.containerDom.append(tempRenderMap[i])
        }
      }
      this.renderMap = tempRenderMap
      const keys = Object.keys(this.renderMap)
      this.startIdx = +keys[0]
      this.endIdx = +keys[keys.length - 1]
    },
    resizeFn() {
      this.computeColumnWidth()
      // 如果宽度发生变化时，若列宽是一致的不用处理
      if (
        this.lastOffsetWidth !== window.innerWidth &&
        this.columnWidth === this.domDataList[0]?.width
      )
        return
      this.lastOffsetWidth = window.innerWidth
      this.initPositionList()
      this.domDataList = []
      this.renderMap = {}
      this.computeDomData(this.list, 0)
      this.renderDomByDomDataList(0)
    },
    // 窗口变化事件
    resize: debounce(function () {
      console.log('resize')
      if (this.isLoadNextPage) {
        // 加载数据时发生了视口变化，保存回调
        this.resizeCallback = this.resizeFn()
        return
      }
      this.resizeFn()
    }, 150),
    // 窗口滚动事件
    handleScroll: throttle(async function () {
      this.waterfallContainerDom.scrollTop >= window.innerHeight
        ? this.gotoTopDom.classList.add('active')
        : this.gotoTopDom.classList.remove('active')
      this.scrollDirection =
        this.waterfallContainerDom.scrollTop - this.lastScrollNumY >= 0 ? 1 : -1
      this.lastScrollNumY = this.waterfallContainerDom.scrollTop

      this.updateDomPosition(this.scrollDirection)

      if (this.isLoadNextPage || !this.hasNextPage) return false
      if (
        this.waterfallContainerDom.scrollTop +
          this.waterfallContainerDom.offsetHeight >=
        this.waterfallContainerDom.scrollHeight * 0.85
      ) {
        this.isLoadNextPage = true
        this.loadingDom.classList.add('active')
        this.page += 1
        const list = await this.getList()
        this.isLoadNextPage = false
        this.loadingDom.classList.remove('active')
        // 加载数据期间发生了视口变化时，执行一次回调
        if (this.resizeCallback) {
          this.resizeCallback()
          this.resizeCallback = null
        } else {
          // 节点信息排列完毕后进行渲染
          const startIdx = (this.page - 1) * this.pageSize
          this.computeDomData(list, startIdx)
          this.renderDomByDomDataList(startIdx)
        }
      }
    }, 150),
    onclick() {
      // 渠道顶部
      this.waterfallContainerDom.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      })
    },
    // 3
    async getData() {
      this.computeDomData(await this.getList(), 0)
      // 节点信息排列完毕后进行渲染
      this.renderDomByDomDataList(0)
    },
  },
  mounted() {
    this.waterfallContainerDom = document.querySelector('.water-fall-container')
    this.screenOffset = this.waterfallContainerDom.offsetHeight / 2
    this.containerDom = document.querySelector('.box')
    this.loadingDom = document.querySelector('.loading')
    this.gotoTopDom = document.querySelector('.to-top')
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
    this.getData()
  },
}
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
  display: flex;
}
html {
  overflow: hidden;
}
.container {
  height: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  padding-top: 0px;
}
.to-top {
  position: fixed;
  right: 40px;
  bottom: 40px;
  cursor: pointer;
  transform: scale(0);
  transition: transform 0.15s;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8f8f8;
  color: tomato;
  font-size: 32px;
}
.to-top.active {
  transform: scale(1);
}

.loading {
  height: 32px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  opacity: 0;
  transition: all 0.15s;
}

.loading.active {
  opacity: 1;
}

.header {
  height: 80px;
  background-color: #aaa;
}

.water-fall-container::-webkit-scrollbar {
  width: 8px;
  background-color: #eee;
}
.water-fall-container::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 4px;
}

.water-fall-container::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}

.water-fall-container {
  padding: 20px;
  height: calc(100% - 130px);
  overflow-y: scroll;
  overflow-x: hidden;
}

.box {
  position: relative;
  width: 100%;
}

.waterfall-item {
  position: absolute;
  transition: all 0.12s;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
}

.main {
  flex-grow: 1;
  flex-shrink: 0;
  background-color: pink;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  object-fit: contain;
}
.footer {
  box-sizing: border-box;
  padding: 12px;
  background-color: darksalmon;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.info {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 10px;
  letter-spacing: 0;
}
</style>
