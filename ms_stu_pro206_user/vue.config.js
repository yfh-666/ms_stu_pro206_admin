const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // assetsDir: 'static',
  // parallel: false,
  publicPath: './',
  transpileDependencies: true,
  // 本地代理
  devServer: {
    port:8081,
    proxy: {
      [process.env.VUE_APP_BASE_API]:
      {
        target: 'http://mashang.eicp.vip:5555/ms_stu_pro206',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }

})


