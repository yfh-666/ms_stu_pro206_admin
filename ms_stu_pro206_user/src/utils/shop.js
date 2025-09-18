import Cookies from 'js-cookie'
const ShopIdKey = 'Customer-ShopId'

export function getShopId() {
  return Cookies.get(ShopIdKey)
}

export function setShopId(ShopId) {
  if (ShopId != undefined) {
    return Cookies.set(ShopIdKey, ShopId, { expires: 1 })
  }
}

export function removeShopId() {
  return Cookies.remove(ShopIdKey)
}
