var path = require('path')

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: './index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'docs')
  },
  devtool: 'source-map',
  devServer: {
    static: './docs'
  }
}
