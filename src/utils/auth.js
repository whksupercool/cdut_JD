import Cookies from 'js-cookie'

const TokenKey = 'JD-HRSAAS-TOKEN'
// 设置一个独一无二的 时间戳 key
const TimeKey = 'HRSAAS-TIMESTAMP-KEY'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}
// 设置时间戳
export function setTimeStamp() {
  Cookies.set(TimeKey, Date.now())
}
