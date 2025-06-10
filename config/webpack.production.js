const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { resolve, join } = require('path') 
module.exports = {
  output: {
    path: join(__dirname, '../dist'),
    publicPath: '/',
    filename: 'js/[name].[contenthash:5].bundle.js',
    assetModuleFilename: 'assets/[name].[contenthash:5][ext]'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../src/index-prod.html')
    }),
    new CssMinimizerPlugin()
  ]
}