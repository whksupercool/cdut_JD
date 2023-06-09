import request from '@/utils/request'

// 登录
export function login(data) {
    // 返回一个axios对象 => promise  // 返回了一个promise对象
    return request({
        url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
        method: 'post',
        data // body参数体位于data
    })
}
// 获得用户信息
export function getUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'post'
    })
}
// 获取用户的基本信息
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}
// 登出
export function logout() {

}