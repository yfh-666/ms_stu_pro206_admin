import request from '@/utils/request'

// 查询商品订单列表
export function listOrder(query) {
  return request({
    url: '/sass/lessee/order/list',
    method: 'get',
    params: query
  })
}
// 修改商品订单
export function updateOrder(data) {
  return request({
    url: '/sass/lessee/order/update',
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}