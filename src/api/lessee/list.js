import request from '@/utils/request'

// 查询租户列表
export function listLessee(query) {
  return request({
    url: 'sass/admin/lessee/list',
    method: 'get',
    params: query
  })
}
// 菜单下拉获取菜单编号和名称
export function listDropdownbox() {
  return request({
    url: '/sass/admin/lesseemeal/dropdownbox',
    method: 'get',
  })
}
// 新增租户
export function addLessee(query) {
  return request({
    url: '/sass/admin/lessee/add',
    method: 'post',
    params: query
  })
}

// 修改租户
export function updateLessee(query) {
  return request({
    url: '/sass/admin/lessee/update',
    method: 'put',
    params: query
  })
}
// 删除租户
export function delLessee(query) {
  return request({
    url: '/sass/admin/lessee/delete',
    method: 'put',
    params: query
  })
}
