const path = require('path')
const webpack = require('webpack')
const htmlPlugin = require('html-webpack-plugin')

const {
  NODE_ENV, VSCODE_ENV,
} = process.env

// 通用配置
const config = {
  target: 'web',
  entry: path.join(__dirname, '../app/index.js'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '../app'),
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new htmlPlugin({
      title: 'simple-react-app',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      NODE_ENV: `${NODE_ENV}`
    })
  ]
}

if (NODE_ENV == 'development') {
  // 开发环境配置
  config.devtool = 'cheap-module-eval-source-map'
  config.devServer = {
    port: 7899,
    host: '0.0.0.0',
    hot: true,
    inline: true,
    clientLogLevel: 'none', // 屏蔽啰嗦的 WDS 日志
    historyApiFallback: true,
    overlay: {
      errors: true
    },
    // open: true,
  }

  // 使用 vscode Chrome debug 启动
  if (VSCODE_ENV) {
    Object.assign(config.devServer, {
      quiet: true,
      progress: true,
    })
  }

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else if (NODE_ENV == 'production') {
  // 生产环境配置
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin() // 压缩 js
  )
}

module.exports = config