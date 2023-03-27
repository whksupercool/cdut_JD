const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 在根级的getters上 开发子模块的属性给别人看 给别人用
  token: state => state.user.token,
  // 建立用户名的映射
  name: state => state.userInfo.username,
}
export default getters
