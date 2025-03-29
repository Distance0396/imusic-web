import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/scss/index.scss'
import '@/assets/scss/theme.scss'
import ElementUI from 'element-ui'
import './assets/iconfont/iconfont.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ElementTiptapPlugin } from 'element-tiptap'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-tiptap/lib/index.css'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { useContextMenu } from '@/utils/useContextMenu'
import VueLazyload from 'vue-lazyload'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

Vue.prototype.$dayjs = dayjs
Vue.prototype.$useContextMenu = useContextMenu

Vue.use(VueLazyload, {
  preLoad: 1,
  loading: require('./assets/loading.gif'),
  attempt: 1
})
Vue.use(VueVirtualScroller)
Vue.use(ElementUI)
Vue.use(ElementTiptapPlugin, {
  lang: 'zh'
})
Vue.config.productionTip = false

Vue.use(VueReCaptcha, {
  siteKey: '6LeNfRYqAAAAALtUVfNp5GAyLQJebGTWFU0w6WDQ',
  loaderOptions: {
    // google域名替换为recaptcha
    useRecaptchaNet: true,
    // 隐藏reCAPTCHA小图标
    autoHideBadge: true
  }
})

/**
 * 标签页name
 */
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title + ' - ' + '空白的一坪'
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
