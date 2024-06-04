import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/layout/home.vue'
import Explore from '@/views/layout/explore.vue'
import Login from '@/views/login/index.vue'
import Singer from '@/views/detail/singer.vue'
import Album from '@/views/detail/album.vue'
import MusicForm from '@/views/detail/musicForm.vue'
import Layout from '@/views/layout/index.vue'
import Search from '@/views/search/search.vue'
Vue.use(VueRouter)

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home
        },
        {
          path: '/explore',
          redirect: '/explore/search',
          children: [
            {
              path: '/explore/search',
              name: 'Search',
              component: Search,
              meta: { title: '搜索' }
            },
            {
              path: '/explore/singer',
              name: 'Explore',
              component: Explore,
              meta: { title: '歌手' }
            }
          ]
        },
        {
          path: '/detail/singer/:id',
          name: 'Singer',
          component: Singer
        },
        {
          path: '/detail/album/:id',
          name: 'Album',
          component: Album
        },
        {
          path: '/detail/music-form/:id',
          name: MusicForm,
          component: MusicForm
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
      component: () => import('@/views/404'),
      hidden: true
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
})

export default router
