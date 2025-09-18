import request from '@/utils/request'
// 查询桌号列表
export function listTable(query) {
  return request({
    url: 'ms/lessee/table/list',
    method: 'get',
    params: query
  })
}
// 查询桌号详情
export function detailTable(query) {
  return request({
    url: 'ms/lessee/table/detail',
    method: 'get',
    params: query
  })
}
// 查询桌号订单列表
export function listOrder(query) {
  return request({
    url: 'ms/lessee/table/order/list',
    method: 'get',
    params: query
  })
}
// 查询订单详情
export function detailOrder(query) {
  return request({
    url: 'ms/lessee/table/order/detail',
    method: 'get',
    params: query
  })
}
// 批量新增桌号
export function createTableBranch(query) {
  return request({
    url: 'ms/lessee/table/create/branch',
    method: 'post',
    params: query
  })
}
// 新增桌号
export function createTable(query) {
  return request({
    url: 'ms/lessee/table/create',
    method: 'post',
    params: query
  })
}

// 修改桌号
export function updateTable(query) {
  return request({
    url: 'ms/lessee/table/update',
    method: 'put',
    params: query
  })
}
// 删除桌号
export function delTable(query) {
  return request({
    url: 'ms/lessee/table/delete',
    method: 'put',
    params: query
  })
}
