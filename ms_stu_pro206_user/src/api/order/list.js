import request from '@/utils/request'

// 客户获取订单列表
export function orderList(query) {
  return request({
    url: '/sass/customer/order/list',
    method: 'get',
    params: query
  })
}
// 客户获取订单详情
export function orderDtl(query) {
  return request({
    url: '/sass/customer/order/dtl',
    method: 'get',
    params: query
  })
}
// 客户编辑订单
export function orderEdit(data) {
  return request({
    url: '/sass/customer/order/edit',
    method: 'put',
    data: data,
    headers: {
      "Content-Type":"application/x-www-form-urlencoded"
    },
  })
}
// 客户支付订单
export function orderPay(query) {
  return request({
    url: '/sass/customer/order/pay',
    method: 'put',
    params: query
  })
}
