var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrors = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new FriendlyErrors()
  ]
})

// Vue multi pages
var pages = utils.entriesHtml
for(var page in pages) {
  var fileName = page.split('/')[1] === 'home' ? 'index' + '.html' : page.split('/')[1] + '.html'
  var conf = {
    filename: fileName,
    template: pages[page],
    inject: true,
    chunks: [page, 'vendor', 'manifest']
  }
  //console.log(conf)
  //console.log(fileName)

  // https://github.com/ampedandwired/html-webpack-plugin
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}