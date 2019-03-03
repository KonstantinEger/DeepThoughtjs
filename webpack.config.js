const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'dt.js',
    path: path.join(__dirname, 'dist'),
    library: 'DeepThought'
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  }
}