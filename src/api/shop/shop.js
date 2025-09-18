import request from '@/utils/request'
// 查询门店列表
export function listShop(query) {
  return request({
    url: 'ms/lessee/shop/list',
    method: 'get',
    params: query
  })
}
// 查询门店详情
export function detailShop(query) {
  return request({
    url: 'ms/lessee/shop/detail',
    method: 'get',
    params: query
  })
}
// 下拉框查询门店
export function getShop(query) {
  return request({
    url: 'ms/lessee/shop/shop/get',
    method: 'get',
    params: query
  })
}
// 下拉框查询管理员
export function listUser(query) {
  return request({
    url: '/sass/lessee/user/list',
    method: 'get',
    params: query
  })
}

// 新增门店
export function createShop(query) {
  return request({
    url: 'ms/lessee/shop/create',
    method: 'post',
    params: query
  })
}

// 修改门店
export function updateShop(query) {
  return request({
    url: 'ms/lessee/shop/update',
    method: 'put',
    params: query
  })
}
// 删除门店
export function delShop(query) {
  return request({
    url: '/ms/lessee/shop/delete',
    method: 'put',
    params: query
  })
}
