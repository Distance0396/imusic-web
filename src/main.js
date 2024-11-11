import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/scss/index.scss'
import '@/assets/scss/theme.scss'
import ElementUI from 'element-ui'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'

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
Vue.use(ElementUI)

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
