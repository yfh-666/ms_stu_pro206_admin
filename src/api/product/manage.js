import request from '@/utils/request'

// 查询商品列表
export function listProduct(query) {
  return request({
    url: '/sass/product/page',
    method: 'get',
    params: query
  })
}
// 查询商品详情
export function dtlProduct(query) {
  return request({
    url: '/sass/product/info',
    method: 'get',
    params: query
  })
}

// 新增商品
export function addProduct(data) {
  return request({
    url: '/sass/product',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}
// 修改商品
export function updateProduct(data) {
  return request({
    url: '/sass/product',
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}
// 删除商品
export function delProduct({ productId, ...data }) {
  return request({
    url: `/sass/product/${productId}`,
    method: 'delete',
    data
  })
}
