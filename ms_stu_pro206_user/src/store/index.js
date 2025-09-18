import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import dict from './modules/dict'
import order from './modules/order'
import shoppingCart from './modules/shoppingCart'
import getters from './getters'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    dict,
    shoppingCart,
    order
  },
  getters
})

export default store