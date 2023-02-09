const port = process.env.port || process.env.npm_config_port || 3000; // dev port
module.exports = {
  productionSourceMap: false,

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
    }
  },

  chainWebpack: (config) => {
    config.externals({
      'vue': 'Vue',
      'element-ui': 'ElementUI',
    })
  },

  devServer: {
    port: port,
    open: true,
    disableHostCheck: process.env.NODE_ENV === "development" ? true : false,
    proxy: {
      "/app": {
        target: "http://10.206.14.121:8000",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/app": "/app"
        }
      },
      '/assembly-form': {
        // target: "http://10.206.1.153/assembly-form",
        target: "https://servicecloud.ccsiot.com/assembly-form",
        changeOrigin: true,
        pathRewrite: {
          "/assembly-form": ""
        }
      },
      '/ccstaglib-new': {
        target: "https://ccstaglib.ccsiot.com/ccstaglib-new",
        changeOrigin: true,
        pathRewrite: {
          "/ccstaglib-new": ""
        }
      },
      "/place": {
        target: "http://api.map.baidu.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            "^/place": "/place"
        }
      },
      "/geocoder": {
        target: "http://api.map.baidu.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            "^/geocoder": "/geocoder"
        }
      }
    }
  },

  css: {
    extract: false
  },

  lintOnSave: false
}
