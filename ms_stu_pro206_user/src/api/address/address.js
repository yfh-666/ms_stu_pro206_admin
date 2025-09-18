import request from '@/utils/request'

// 客户获取外卖地址列表
export function addressList(query) {
  return request({
    url: '/sass/customer/takeawayaddress/list',
    method: 'get',
    params: query
  })
}
// 客户删除外卖地址
export function addressDelete(query) {
  return request({
    url: '/sass/customer/takeawayaddress/delete',
    method: 'delete',
    params: query
  })
}
// 客户编辑外卖地址(只能有一个默认地址)
export function addressEdit(query) {
  return request({
    url: '/sass/customer/takeawayaddress/edit',
    method: 'put',
    params: query
  })
}
// 客户获取外卖地址详情
export function addressDtl(query) {
  return request({
    url: '/sass/customer/takeawayaddress/dtl',
    method: 'get',
    params: query
  })
}
