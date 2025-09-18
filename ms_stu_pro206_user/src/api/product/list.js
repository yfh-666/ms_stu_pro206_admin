import request from '@/utils/request'

// 客户获取商品列表
export function productList(query) {
  return request({
    url: 'sass/customer/product/list',
    method: 'get',
    params: query,
    headers: {
      isToken: true
    },
  })
}
// 客户获取商品列表
export function productUpdate(data) {
  return request({
    url: '/sass/customer/product/update',
    method: 'put',
    data: data,
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    }
  })
}
// 客户获取商品简介(和商品详情数据差不多)
export function productIntroduction(query) {
  return request({
    url: '/sass/customer/product/introduction',
    method: 'get',
    params: query
  })
}
// 客户获取商品详情
export function productDtl(query) {
  return request({
    url: '/sass/customer/product/dtl',
    method: 'get',
    params: query
  })
}
// 客户获取商品列表营销积分之和
export function productCredits(data) {
  return request({
    url: '/sass/customer/product/credits',
    method: 'post',
    data: data,
    headers:{
      "Content-Type":"application/json"
    }
  })
}