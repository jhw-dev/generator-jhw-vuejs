var ExtractTextPlugin = require('extract-text-webpack-plugin')
var autoprefixer = require('autoprefixer')
var webpack = require('webpack')
module.exports = function(config) {
  var obj = {
    //     watch: true,
    //页面入口
    entry: config.script.entry,
    //出口文件输出配置
    output: config.script.output,
    //加载器
    module: {
      loaders: [{
        test: /\.vue$/,
        loader: 'vue'
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          // limit for base64 inlining in bytes
          limit: 10000,
          // custom naming format if file is larger than
          // the threshold
          name: 'images/[name].[ext]?[hash]'
        }
      }, {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }]
    },
    vue: {
      loaders: {
        sass: ExtractTextPlugin.extract('css!postcss!sass'),
        scss: ExtractTextPlugin.extract('css!postcss!sass'),
        css: ExtractTextPlugin.extract('css!postcss')
      }
    },
    babel: {
      presets: ['es2015'],
      plugins: ['transform-runtime']
    },
    plugins: [
      new ExtractTextPlugin('entry.css')
    ],
    postcss: [autoprefixer]
  };
  if (process.env.NODE_ENV === 'production') {
    obj.plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new ExtractTextPlugin('entry.css'),
      new webpack.optimize.OccurenceOrderPlugin()
    ]
  } else {
    obj.devtool = '#source-map'
  }

  return obj
}
