import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/styles/index.scss' // global css
import '@/assets/icon_font/iconfont.css';
Vue.config.productionTip = false
import Vant from "vant"
import 'vant/lib/index.css';
Vue.use(Vant)
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
import { getDicts } from "@/api/system/dict/data"
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 引入vue-amap
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '64d43edc9462657a2d78493bd0560534',
  // 插件集合
  plugin: [
    'AMap.CircleEditor',// 圆形编辑器插件
    "AMap.Geolocation", // 定位控件，用来获取和展示用户主机所在的经纬度位置
    "AMap.Geocoder", // 地理编码与逆地理编码服务，用于地址描述与坐标间的相互转换
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.CitySearch",
  ],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});
//高德的安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '2850358827cebcc414bb37bbba20cdc6',
}
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.handleTree = handleTree



new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')

