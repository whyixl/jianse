module.exports = {
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production'
      ? '/jianse/'
      : '/',
  // 放置静态资源的地方 (js/css/img/font/...)
  assetsDir: 'static',
  outputDir: 'jianse',
  devServer: {
    // 跨域代理配置
    proxy: {
      '/api/': {
        'target': 'http://127.0.0.1:8088', //后台接口
        'secure': false, // false为http访问，true为https访问
        'changeOrigin': true, // 跨域访问设置，true代表跨域
        'pathRewrite': { // 路径改写规则
          '^/api': '' // 以/proxy/为开头的改写为''
        }
      }
    }
  }
};
