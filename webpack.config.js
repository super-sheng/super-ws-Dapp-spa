const { resolve } = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const argv = require('yargs-parser')(process.argv.slice(2))
const _mode = argv.mode || 'development'
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const dev = _mode === 'development'

const webpackBaseConfig = {
  entry: './src/index.tsx',
  output: {
    path: resolve(process.cwd(), 'dist'),
    filename: dev ? "[name].js" : "[name].[contenthash].js",
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@services': resolve(__dirname, 'src/services'),
      '@types': resolve(__dirname, 'src/types'),
      "@connections/*": resolve(__dirname, './src/connections/*'),
      "@abis/*": resolve(__dirname, './src/abis/*'),
      "@layouts/*": resolve(__dirname, './src/layouts/*'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)/,
        exclude: /(node_modules)/,
        use: 'swc-loader'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader,"css-loader"],
      },
    ],
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: dev ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: dev ? "[id].css" : "[id].[contenthash].css",
    })
  ],

  // stats: 'errors-only'

}

module.exports = merge(webpackBaseConfig, _mergeConfig)