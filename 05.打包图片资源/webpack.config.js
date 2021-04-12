const { resolve } = require("path");
const htmlWebpackPlugins = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "build.js",
    path: resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        /** 处理图片资源 */
        /** 问题：默认处理不了html中的img图片 */
        test: /\.(jpg|png|gif)$/,
        /** 只使用一个loader不用use */
        /** 需要下载 url-loader file-loader */
        loader: "url-loader",
        options: {
          // 图片大小小于8kb，就会被base64处理
          // 优点：减少请求数量（减轻服务器压力）
          // 缺点：图片体积会更大（文件请求速度更慢）
          // base64在客户端本地解码所以会减少服务器压力，如果图片过大还采用base64编码会导致cpu调用率上升，网页加载时变卡
          limit: 8 * 1024,
          /** 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs，解析时会出现问题：img的src变为[object Module] */
          /** 解决：关闭url-loader的es6模块化解析，使用commonjs解析 */
          esModule: false,
          /** 给图片重命名 */
          /** [hash:10]取图片的hash的前10位 */
          /** [ext]取文件原来扩展名 */
          name: "[hash:10].[ext]",
        },
      },
      {
        test: /\.html$/,
        /** 处理html文件的img图片（负责引入img，从而能被url-loader进行处理） */
        loader: "html-loader",
        /** webpack5中html-loader也需要关闭es6模块化解析 */
        options: {
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugins({
      template: "./src/index.html",
    }),
  ],
  mode: "development",
};
