import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout'
import Home from '@/views/layout/home.vue'
import Explore from '@/views/layout/explore.vue'
import Login from '@/views/login/index.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: Home
        },
        {
          path: '/explore',
          component: Explore
        }
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})

export default router
