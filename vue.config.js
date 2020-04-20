// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development';

// 本地环境是否需要使用cdn
const devNeedCdn = true;

// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT',
    'vue-lazyload': 'VueLazyload',
  },
  // cdn的css链接
  css: [
    'https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css',
    'https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/display.css'
  ],
  // cdn的js链接
  js: [
    'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
    'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
    'https://cdn.bootcss.com/vue-router/3.0.3/vue-router.min.js',
    'https://cdn.bootcss.com/element-ui/2.13.0/index.js',
    'https://cdn.bootcss.com/vue-lazyload/1.3.3/vue-lazyload.js',
  ]
};

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
  },
  chainWebpack: config => {
    // 解决ie11兼容ES6
    config.entry('main').add('babel-polyfill');
    // ============压缩图片 start============
    config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        .use('image-webpack-loader')
        .loader('image-webpack-loader')
        .options({bypassOnDebug: true})
        .end();
    // ============压缩图片 end============

    // ============注入cdn start============
    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn;
      return args
    });
    // ============注入cdn start============
    config.optimization.minimize(true);
    config.optimization.splitChunks({
      chunks: 'all'
    })
  },
  configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals;

    // 生产环境压缩
    if (isProduction) {
      // 代码压缩
      config.plugins.push(
          new UglifyJsPlugin({
            uglifyOptions: {
              //生产环境自动删除console
              compress: {
                // warnings: false, // 若打包错误，则注释这行
                drop_debugger: true,
                drop_console: true,
                pure_funcs: ['console.log']
              }
            },
            sourceMap: false,
            parallel: true
          })
      );

      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css'];
      config.plugins.push(
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' + productionGzipExtensions.join('|') + ')$'
            ),
            threshold: 10240, // 只有大小大于该值的资源会被处理 10240
            minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: false // 删除原文件
          })
      );

      // 公共代码抽离
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c)ss$/,
              chunks: 'all',
              enforce: true
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      }
    }
  }
};
