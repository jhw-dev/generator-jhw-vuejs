var vue = require('vue-loader')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')
var webpack = require('webpack')
module.exports = function(config) {
  return {
    // watch: true,
    //页面入口
    entry: config.script.entry,
    //出口文件输出配置
    output: config.script.output,
    //source map 支持
    devtool: config.script.sourceMap ? '#source-map' : '',
    //加载器
    module: {
      loaders: [{
        test: /\.sass$/,
        loader: 'style!css!sass'
      }, {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }, {
        test: /\.html$/,
        loader: "html"
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel?optional[]=runtime'
      }, {
        test: /\.vue$/,
        loader: vue.withLoaders({
          js: 'babel?optional[]=runtime',
          sass: ExtractTextPlugin.extract('css!postcss-loader!sass'),
          css: ExtractTextPlugin.extract('css!postcss-loader')
        })
      }, {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }]
    },
    plugins: [
      new ExtractTextPlugin('[name].css'),
      new webpack.optimize.UglifyJsPlugin()
    ],
    postcss: function() {
      return [autoprefixer]
    },
    devtool: 'source-map'
  }
}
