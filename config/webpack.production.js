const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const { resolve } = require('path') 
module.exports = {
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