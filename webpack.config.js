const { resolve } = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin
const { GenerateSW } = require('workbox-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const BuildStatsTablePlugin = require('./plugin/BuildStatsTablePlugin')
const argv = require('yargs-parser')(process.argv.slice(2))
const _mode = argv.mode || 'development'
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const dev = _mode === 'development'
const webpackBaseConfig = {
  entry: './src/index.tsx',
  output: {
    path: resolve(__dirname, 'dist'),
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
        use: [MiniCssExtractPlugin.loader,"css-loader", "postcss-loader"],
      },
    ],
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    !dev ? new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,

      // SPA 路由支持
      navigateFallback: '/index.html',
      navigateFallbackAllowlist: [/^(?!\/__).*/],

      exclude: [/\.map$/, /manifest$/, /\.htaccess$/],

      runtimeCaching: [
        // API 缓存
        {
          urlPattern: /^https:\/\/api\.myapp\.com\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 10 * 60 // 10 分钟
            }
          }
        },
        
        // 静态资源
        {
          urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 30 * 24 * 60 * 60
            }
          }
        },
      ]
    }) : null,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: dev ? "[name].css" : "css/[name].[contenthash:5].css",
      chunkFilename: dev ? "[id].css" : "css/[id].[contenthash:5].css",
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    // }),
    new BuildStatsTablePlugin()
  ].filter(Boolean),

  stats: 'errors-only'

}

module.exports = merge(webpackBaseConfig, _mergeConfig)