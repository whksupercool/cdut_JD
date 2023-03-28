// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const TimeOut = 7200 // 定义超时时间

// 创建一个axios的实例
const service = axios.create({
    // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
    // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
    baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
    timeout: 5000 // 定义5秒超时
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 统一注入用户 token
        if (store.getters.token) {
            // 在注入 token 之前判断时间戳是否超时
            if (isCheckTimeout()) {
                // 如果超时了，token没用了，重新登录
                store.dispatch('user/logout') // 登出操作
                router.push('/login') // 重新登录
                return Promise.reject(new Error('token 超时了'))
            }
            // 如果 token存在，就注入 token
            config.headers['Authorization'] = `Bearer ${store.getters.token}`
        }

        return config // 必修返回配置
    },
    error => {
        // 返回错误
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // axios默认加了一层data
        const { success, message, data } = response.data
        // 要根据success的成功与否决定下面的操作
        if (success) {
            return data
        } else {
            // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
            Message.error(message) // 提示错误消息
            return Promise.reject(new Error(message))
        }
    },
    error => {
        // error 信息 里面 response的对象
        if (error.response && error.response.data && error.response.data.code === 10002) {
            // 当等于10002的时候 表示 后端告诉我token超时了
            store.dispatch('user/logout') // 登出action 删除token
            router.push('/login')
        } else {
            // 提示错误信息
            Message.error(error.message)
        }
        // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
        return Promise.reject(error)
    }
)

// 判断是否超时，（当前时间-缓存中的时间）/ 1000 > TimeOut
function isCheckTimeout() {
    return (Date.now() - getTimeStamp()) / 1000 > TimeOut
}

// 导出axios实例
export default service 