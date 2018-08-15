const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    host: process.env.HOST,
    open: true,
    overlay: true,
    port: process.env.PORT,
    stats: "errors-only",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo',
    }),
  ]
};
