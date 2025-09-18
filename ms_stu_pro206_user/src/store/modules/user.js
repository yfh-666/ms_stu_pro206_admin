import { login } from '@/api/login'
import { getToken, setToken } from '@/utils/auth'
import { getNum  } from '@/utils/num'
import { getPhone } from '@/utils/phone'

const user = {
  state: {
    token: getToken(),
    customerNum:getNum() ,
    phonenumber:getPhone(),
    remark:""
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_CUSTOMERNUM: (state, customerNum) => {
      state.customerNum = customerNum
    },
    SET_PHONENUMBER: (state, phonenumber) => {
      state.phonenumber = phonenumber
    },
    SET_REMARK: (state, remark) => {
      state.remark = remark
    }
  },

  actions: {
    // 登录
    // Login({ commit }, userInfo) {
    //   const customerName = userInfo.customerName
    //   const nickName = userInfo.nickName
    //   const code = userInfo.code
    //   const phonenumber = userInfo.phonenumber
    //   return new Promise((resolve, reject) => {
    //     login({ customerName, nickName, phonenumber, code }).then(res => {
    //       setToken(res.data.token)
    //       commit('SET_TOKEN', res.data.token)
    //       resolve()
    //     }).catch(error => {
    //       // reject(error)
    //     })
    //   })
    // },
  }
}

export default user