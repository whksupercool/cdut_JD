import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// 状态
const state = {
  // 设置token初始状态   token持久化 => 放到缓存中
  token: getToken(),
  // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
  userInfo: {}
}
// 修改状态
const mutations = {
  // 设置token
  SET_TOKEN(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  REMOVE_TOKEN(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  // 删除用户信息
  REMOVE_USER_INFO(state) {
    // 重置为空对象
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async userLogin(context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('SET_TOKEN', result)

    // 在初次登录时，注入时间戳
    setTimeStamp() // 将当前的最新时间写入缓存
  },
  // 获取用户资料action
  async getUserInfoAction(context) {
    // 获取用户信息返回值（不包含头像信息）
    const result = await getUserInfo()
    // 获得员工基本信息 => 得到员工（用户）的头像
    const baseInfo = await getUserDetailById(result.userId)
    // 将两个信息整合在一起
    const baseResult = { ...result, ...baseInfo }
    // 将整个的个人信息设置到用户的vuex数据中
    context.commit('SET_USER_INFO', baseResult)
    // 返回结果，为后面的使用埋下伏笔
    return baseResult
  },
  // 用户登出的 action
  logout(context) {
    // 删除 token（vuex 和缓存中的）
    context.commit('REMOVE_TOKEN')
    // 删除用户资料
    context.commit('REMOVE_USER_INFO')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
