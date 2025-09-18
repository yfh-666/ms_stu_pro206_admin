import request from '@/utils/request'

// 登录方法
// export function login(username, password, code, uuid) {
//   const data = {
//     username,
//     password,
//     code,
//     uuid
//   }
//   return request({
//     url: '/login',
//     headers: {
//       isToken: false,
//       repeatSubmit: false
//     },
//     method: 'post',
//     data: data
//   })
// }


// 登录校验
export function login(query) {
  return request({
    url: 'sass/customer/login/check',
    method: 'get',
    headers: {
      isToken: false
    },
    params: query
  })
}
// 客户层判断当前手机号是否注册
export function getInfo() {
  return request({
    url: '/sass/customer/login/whetherregister',
    method: 'get'
  })
}
// 获取验证码
export function getCode(query) {
  return request({
    url: '/sass/customer/login/code',
    method: 'get',
    params: query
  })
}