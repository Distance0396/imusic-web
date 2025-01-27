import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue'
import Layout from '@/views/layout/index.vue'
import ExploreLayout from '@/views/layout/explore/layout.vue'
Vue.use(VueRouter)

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/layout/home/home.vue')
        },
        {
          path: 'explore',
          name: 'Explore',
          component: ExploreLayout,
          redirect: 'explore/search',
          children: [
            {
              path: 'search',
              name: 'Search',
              component: () => import('@/views/layout/explore/search/index.vue'),
              meta: { title: '搜索' }
            },
            {
              path: 'singer',
              name: 'exploreSinger',
              component: () => import('@/views/layout/explore/all/index.vue'),
              meta: { title: '歌手' }
            }
          ]
        },
        {
          path: 'community',
          name: 'Community',
          component: () => import('@/views/layout/community/index.vue')
        },
        {
          path: 'test',
          name: 'test',
          component: () => import('@/views/layout/community/test.vue')
        },
        {
          path: 'article/:id',
          name: 'Article',
          component: () => import('@/views/article/index.vue')
        },
        {
          path: 'daily',
          name: 'Daily',
          component: () => import('@/views/layout/home/dailyCharts.vue')
        },
        {
          path: 'singer/:id',
          name: 'Singer',
          component: () => import('@/views/detail/singer/index.vue')
        },
        {
          path: 'album/:id',
          name: 'Album',
          component: () => import('@/views/detail/album/index.vue')
        },
        {
          path: 'music-form/:id',
          name: 'MusicForm',
          component: () => import('@/views/detail/playlist/index.vue')
        },
        {
          path: 'user/:id',
          name: 'MyHome',
          component: () => import('@/views/my/index.vue')
        },
        {
          path: 'editor',
          name: 'EditorIndex',
          component: () => import('@/views/layout/community/editor.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      redirect: '/login/account',
      component: Login,
      children: [
        {
          path: 'account',
          name: 'Account',
          component: () => import('@/views/login/account/index.vue')
        },
        {
          path: 'email',
          name: 'Email',
          component: () => import('@/views/login/email/index.vue')
        }
      ]
    },
    {
      path: '/404',
      component: () => import('@/views/404/404.vue'),
      hidden: true
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('imusic_token')
  // 如果目标路由需要认证且用户未登录
  if (!token) {
    if (to.path !== '/login/account' && to.path !== '/login/email') {
      // 重定向到登录页面
      next({ path: '/login/account', query: { backUrl: to.fullPath === '/404' ? '/home' : to.fullPath } })
    } else {
      // 如果目标路由是登录页，直接允许访问
      next()
    }
  } else {
    // 允许访问
    const theme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', theme)
    next()
  }
})

export default router
