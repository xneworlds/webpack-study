const { resolve } = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "build.js",
    path: resolve(__dirname, "build"),
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html",
    }),
    /** 告诉webpack哪些库不参与打包，同时使用时的名称也得变 */
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, "dll/manifest.json"),
    }),
    /** 将某个文件打包输出到build目录下，并在html中自动引入该资源 */
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, "dll/jquery.js"),
      /** 文件输出目录 */
      outputPath: "dll",
      /** 脚本或链接标记的公共路径 */
      publicPath: "dll",
    }),
  ],
  mode: "production",
};
