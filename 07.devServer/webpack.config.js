const { resolve } = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "build.js",
    path: resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      /** 打包其他资源(除了html/js/css资源以外的资源) */
      {
        /** 排除css/js/html资源 */
        exclude: /\.(css|js|html)$/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
        },
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  mode: "development",

  /** 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~） */
  /** 特点：只会在内存中编译打包，不会有任何输出（不会像之前那样看到build包，而是在内存中，关闭后会自动删除） */
  /** 需要安装包 webpack-dev-server */
  /** 启动devServer指令为：npx webpack serve */
  devServer: {
    /** 项目构建后路径 */
    contentBase: resolve(__dirname, "build"),
    /** 启动gzip压缩 */
    compress: true,
    /** 端口号 */
    port: 3000,
    /** 自动打开浏览器 */
    open: true,
  },
  /** 解决配置browserslist后devServer不自动刷新的问题 */
  target: (process.env.NODE_ENV = "production" ? void 0 : "web"),
};
