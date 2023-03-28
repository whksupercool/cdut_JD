// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

// 路由的前置守卫
router.beforeEach(async function (to, from, next) {
    NProgress.start() // 开启进度条
    // 1. 首先判断有无 token
    if (store.getters.token) {
        // 1.1 有 token，继续判断是不是去登录页
        if (to.path === '/login') {
            // 1.2 去登录页 => 直接跳到主页
            next('/')
        } else {
            // 要判断是不是已经获取过资料了
            if (!store.getters.userId) {
                // 如果id不存在 意味着当前没有用户资料 就要去获取用户资料
                await store.dispatch('user/getUserInfoAction')
            }

            // 1.3 不是去登录页 => 直接放行
            next()
        }
    } else {
        // 2. 如果没有 token
        if (whiteList.indexOf(to.path) > -1) {
            // 2.1 没有 token，但是跳转页面在白名单内 => 放行
            next()
        } else {
            // 2.2 没有 token，且不在白名单内 => 跳到登录页
            next('/login')
        }
    }
    NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 后置守卫
router.afterEach(function () {
    NProgress.done() // 关闭进度条
})