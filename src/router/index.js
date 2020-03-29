import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Login from '../views/login/Login'
//const Login = () => import('../views/login/login')
const Home = () => import("../views/home/Home")
const Welcome = () => import('../views/home/childrencomponents/Welcome')
const Users = () => import('../views/home/childrencomponents/Users')

const routes = [{
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由全局守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径 from代表从那个路径过来 next是一个函数，表示放行 next()放行 next('/login')强制跳转

  //如果访问的是login页面直接放行
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  //过没有tokenStr 强制跳转到login页面
  if (!tokenStr) return next('/login')
  //有tokenStr 放行
  next()
})



export default router