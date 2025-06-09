const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve, join } = require('path') 
module.exports = {
  devServer: {
    historyApiFallback: true,
    // devMiddleware: {
    //   writeToDisk: true, // serve 模式时写入磁盘
    // },
    static: {
      directory: resolve(__dirname, '../dist'),
    },
    port: 3003,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../src/index-dev.html')
    })
  ]
}