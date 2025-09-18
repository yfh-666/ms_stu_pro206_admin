import request from '@/utils/request'

// 用户获取店铺外卖配送费
export function shopDeliverycost(query) {
  return request({
    url: '/sass/customer/shop/deliverycost',
    method: 'get',
    params: query
  })
}
// 用户获取店铺简介
export function shopIntroduction(query) {
  return request({
    url: '/sass/customer/shop/introduction',
    method: 'get',
    params: query
  })
}


