const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve, join } = require('path')
const { networkInterfaces } = require('os')
const NotifierPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const port = '3003'

function getLocalIP() {
  const nets = networkInterfaces()
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}
module.exports = {
  devServer: {
    historyApiFallback: true,
    // devMiddleware: {
    //   writeToDisk: true, // serve 模式时写入磁盘
    // },
    static: {
      directory: resolve(__dirname, '../dist'),
    },
    port,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../src/index-dev.html')
    }),
    new NotifierPlugin({
      compilationSuccessInfo: {
        messages: [
          '🌐 Development server is running:',
          `Local:    http://localhost:${port}`,
          `Network:  http://${getLocalIP()}:${port}`
        ],
        notes: ['🍎 构建信息请及时查看右上角信息']
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        notifier.notify({
          title: "Webpack error",
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
        });
      }
    })
  ]
}
