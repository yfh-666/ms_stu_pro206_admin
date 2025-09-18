import request from '@/utils/request'

// 查询套餐列表
export function listLesseemeal(query) {
  return request({
    url: 'sass/admin/lesseemeal/list',
    method: 'get',
    params: query
  })
}
// 查询套餐详情
export function dtlLesseemeal(query) {
  return request({
    url: 'sass/admin/lesseemeal/dtl',
    method: 'get',
    params: query
  })
}
// 查询下拉树列表
export function listTreeselect() {
  return request({
    url: 'sass/admin/lesseemeal/treeselect',
    method: 'get'
  })
}

// 修改/新增套餐
export function updateLesseemeal(query) {
  return request({
    url: 'sass/admin/lesseemeal/edit',
    method: 'put',
    params: query
  })
}
// 删除套餐
export function delLesseemeal(query) {
  return request({
    url: 'sass/admin/lesseemeal/delete',
    method: 'delete',
    params: query
  })
}
