import request from '@/utils/request'

// 查询商品规格列表
export function listSpecification(query) {
  return request({
    url: '/sass/specification/page',
    method: 'get',
    params: query
  })
}
// 获取商品规格信息下拉框
export function lisSpecification() {
  return request({
    url: '/sass/specification/list',
    method: 'get',
  })
}
// 新增商品规格
export function addSpecification(data) {
  return request({
    url: '/sass/specification',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}

// 修改商品规格
export function updateSpecification(data) {
  return request({
    url: '/sass/specification',
    method: 'put',
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },

  })
}
// 删除商品规格
export function delSpecification({ specificationId, ...data }) {
  return request({
    url: `/sass/specification/${specificationId}`,
    method: 'delete',
    data
  })
}
