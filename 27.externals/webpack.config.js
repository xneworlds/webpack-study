const { resolve } = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "build.js",
    path: resolve(__dirname, "build"),
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  mode: "production",
  externals: {
    /** 拒绝jQuery被打包进来(通过cdn引入，速度会快一些) */
    /** 忽略的库名 -- npm包名 */
    /** 忽略的包需要在html中手动引入 */
    jquery: "jQuery",
  },
};
