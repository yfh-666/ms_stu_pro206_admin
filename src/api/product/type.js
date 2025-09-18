import request from '@/utils/request'

// 查询商品分类列表
export function listProducttype(query) {
  return request({
    url: '/sass/producttype/page',
    method: 'get',
    params: query
  })
}
// 获取商品分类详情
export function dtlProducttype(query) {
  return request({
    url: '/sass/producttype/info',
    method: 'get',
    params: query
  })
}
// 获取商品分类信息下拉框
export function listbyshopid(query) {
  return request({
    url: '/sass/producttype/sass/listbyshopid',
    method: 'get',
    params: query
  })
}
// 获取商品分类信息下拉框
export function listDropdownbox(query) {
  return request({
    url: '/sass/producttype/sass/list',
    method: 'get',
    params: query
  })
}
// 新增商品分类
export function addProducttype(data) {
  return request({
    url: '/sass/producttype',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateProducttype(data) {
  return request({
    url: '/sass/producttype',
    method: 'put',
    data: data,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}
// 删除商品分类
export function delProducttype({ sassProducttypeId, ...data }) {
  return request({
    url: `/sass/producttype/${sassProducttypeId}`,
    method: 'delete',
    data
  })
}
