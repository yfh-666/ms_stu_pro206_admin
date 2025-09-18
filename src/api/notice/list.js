import request from '@/utils/request'

// 查询公告列表
export function listNotice(query) {
  return request({
    url: '/sass/adminandlessee/notice/list',
    method: 'get',
    params: query
  })
}
// 查询公告列表详情
export function dtlNotice(query) {
  return request({
    url: '/sass/adminandlessee/notice/dtl',
    method: 'get',
    params: query
  })
}

// 编辑公告
export function updateNotice(query) {
  return request({
    url: '/sass/admin/notice/edit',
    method: 'post',
    params: query
  })
}
// 删除公告
export function delNotice(query) {
  return request({
    url: '/sass/admin/notice/delete',
    method: 'POST',
    params: query
  })
}

// 管理与租户层获取订单总数
export function orderTotal(query) {
  return request({
    url: '/sass/adminandlessee/order/total',
    method: 'get',
    params: query
  })
}
// 管理与租户层获取总金额
export function orderMoney(query) {
  return request({
    url: '/sass/adminandlessee/order/money',
    method: 'get',
    params: query
  })
}
// 会员总数
export function lesseeTotal() {
  return request({
    url: '/sass/admin/lessee/total',
    method: 'get',
  })
}
// 商品总数
export function productTotal() {
  return request({
    url: '/sass/adminandlessee/product/total',
    method: 'get',
  })
}