import request from '@/utils/request'

// 客户获取购物车详情
export function shoppingcartDtl(query) {
  return request({
    url: '/sass/customer/shoppingcart/dtl',
    method: 'get',
    params: query,
    headers: {
      isToken: true
    },
  })
}
// 客户编辑购物车
export function shoppingcartEdit(data) {
  return request({
    url: '/sass/customer/shoppingcart/update',
    method: 'post',
    data: data,
    headers: {
      isToken: true,
      "Content-Type":"application/x-www-form-urlencoded"
    },
  })
}
// 客户删除购物车商品
export function shoppingcartDelete(data) {
  return request({
    url: '/sass/customer/shoppingcart/delete',
    method:'delete',
    data: data,
    headers: {
      isToken: true,
      "Content-Type":"application/x-www-form-urlencoded"
    },
  })
}
// 客户新增购物车
export function shoppingcartAdd(data) {
  return request({
    url: '/sass/customer/shoppingcart/add',
    method: 'put',
    data: data,
    headers: {
      isToken: true,
      "Content-Type":"application/x-www-form-urlencoded"
    },
  })
}
