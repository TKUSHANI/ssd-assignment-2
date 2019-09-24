import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Uploader from './views/Uploader.vue'
import VueCookies from 'vue-cookies'
import { log } from 'util';

Vue.use(Router,VueCookies)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/uploader',
      name: 'uploader',
      component: Uploader,
      meta: {
        requiresAuth: true
      }
    },
  ]
})



router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if ($cookies.get('token') != null) {
      store.commit('auth_success', "success", $cookies.get('token'), $cookies.get('user'))
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
