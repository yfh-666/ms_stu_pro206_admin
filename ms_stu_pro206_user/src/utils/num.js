import Cookies from 'js-cookie'

const NumKey = 'Customer-Num'

export function getNum() {
  return Cookies.get(NumKey)
}

export function setNum(Num) {
  return Cookies.set(NumKey, Num, { expires: 1 })
}

export function removeNum() {
  return Cookies.remove(NumKey)
}
