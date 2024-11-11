import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/layout/home/home.vue'
import SingerList from '@/views/layout/explore/all/index.vue'
import Login from '@/views/login/index.vue'
import Singer from '@/views/detail/singer/index.vue'
import Album from '@/views/detail/album/index.vue'
import SongList from '@/views/detail/playlist/index.vue'
import Layout from '@/views/layout/index.vue'
import Search from '@/views/layout/explore/search/index.vue'
import PlayList from '@/views/layout/play/index.vue'
import ExploreLayout from '@/views/layout/explore/layout.vue'
import PlayListLayout from '@/views/layout/play/layout.vue'
import My from '@/views/my/index.vue'
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
          component: Home
        },
        {
          path: 'daily',
          name: 'dailyCharts',
          component: () => import('@/views/layout/home/dailyCharts.vue')
        },
        {
          path: 'explore',
          name: 'Explore',
          component: ExploreLayout,
          redirect: 'explore/search',
          children: [
            {
              path: 'search',
              name: 'exploreSearch',
              component: Search,
              meta: { title: '搜索' }
            },
            {
              path: 'singer',
              name: 'exploreSinger',
              component: SingerList,
              meta: { title: '歌手' }
            }
          ]
        },
        {
          path: 'play',
          name: 'Play',
          redirect: 'play/playlist',
          component: PlayListLayout,
          children: [
            {
              path: 'playlist',
              name: 'PlayList',
              component: PlayList,
              meta: { title: '播放队列' }
            }
          ]
        },
        {
          path: 'detail/singer/:id',
          name: 'Singer',
          component: Singer
        },
        {
          path: 'detail/album/:id',
          name: 'Album',
          component: Album
        },
        {
          path: 'detail/music-form/:id',
          name: 'MusicForm',
          component: SongList
        },
        {
          path: 'user/:id',
          name: 'MyHome',
          component: My
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
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
    if (to.path !== '/login') {
      // 重定向到登录页面
      next({ path: '/login', query: { backUrl: to.fullPath === '/404' ? '/home' : to.fullPath } })
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
