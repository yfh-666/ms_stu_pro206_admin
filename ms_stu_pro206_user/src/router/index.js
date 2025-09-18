
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Layout from '../views/Main.vue'
import { getToken } from '@/utils/auth'
import { getNum } from '@/utils/num'
import { getShopId, setShopId } from '@/utils/shop'
import { getTableId, setTableId,getTableNumber,setTableNumber } from '@/utils/table'
Vue.use(VueRouter)
// Vue.use(store)


const routes = [
  {
    path: '/',
    redirect: '/login/:shopId/:tableId/:tableNumber',
    component: Layout,
    children: [
      {
        path: 'index',
        meta: {
          icon: 'home-o',
          name: '主页',
        },
        component: () => import('@/views/index.vue')
      },
      {
        path: 'menu',
        meta: {
          icon: 'shop-collect-o',
          name: '点餐',
        },
        component: () => import('@/views/menu/index.vue')

      },
      // {
      //   path: 'shoppingCart',
      //   meta: {
      //     icon: 'shopping-cart-o',
      //     name: '购物车',
      //   },
      //   component: () => import('@/views/shoppingCart/index.vue')
      // },
      {
        path: 'order',
        meta: {
          icon: 'bag-o',
          name: '订单',
        },
        component: () => import('@/views/order/index.vue')
      },
      {
        path: 'my',
        meta: {
          icon: 'user-o',
          name: '我的',
        },
        component: () => import('@/views/my/index.vue')
      },

    ]
  },
  {
    path: '/login/:shopId/:tableId/:tableNumber',
    name: 'Login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/scan',
    name: 'Scan',
    component: () => import('@/views/scan.vue')
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('@/views/menu/pay.vue'),

  },

  {
    path: '/orderDetail/:orderId',
    name: 'OrderDetail',
    component: () => import('@/views/order/orderDetail.vue')
  },

  {
    path: '/remark',
    name: 'Remark',
    component: () => import('@/views/menu/remark.vue')
  },
  {
    path: '/addressEdit/:takeawayAddressId',
    name: 'addressEdit',
    component: () => import('@/views/menu/addressEdit.vue')
  },
]

const router = new VueRouter({
  routes
})



// 全局的路由导航守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = getToken(); // 根据实际情况判断用户是否已登录
  const customerNum = getNum()
  if (to.name == "Login" && !isLoggedIn) {
    setShopId(to.params.shopId)
    setTableId(to.params.tableId)
    setTableNumber(to.params.tableNumber)
    next()
  }
  else if (!isLoggedIn && to.name != "Login") {
    next(`/login/${getShopId()}/${getTableId()}/${getTableNumber()}`)
  } else if (isLoggedIn && to.name == "Login") {
    next('/menu')
  }
  else if (!customerNum && to.path !== '/scan' && isLoggedIn) {
    next('/scan')
  }
  else {
    next()
  }
});

export default router
