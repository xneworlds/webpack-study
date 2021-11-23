const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

/*
  缓存：
    1.babel缓存（类似HMR，哪里的js改变就更新哪里，其他js还是用之前缓存的资源）
      cacheDirectory: true
      --> 让第二次打包构建速度更快
    2.文件资源缓存
    文件名不变，就不会重新请求，而是再次用之前缓存的资源
      2.1hash: 每次wepack构建时会生成一个唯一的hash值。
        问题: 因为js和css同时使用一个hash值。
          如果重新打包，会导致所有缓存失效。（可能我却只改动一个文件）
      2.2chunkhash：根据chunk生成的hash值。如果打包来源于同一个chunk，那么hash值就一样
        问题: js和css的hash值还是一样的
          因为css是在js中被引入的，所以同属于一个chunk
      2.3contenthash: 根据文件的内容生成hash值。不同文件hash值一定不一样(文件内容修改，文件名里的hash才会改变)
          （修改css文件内容，打包后的css文件名hash值就改变，而js文件没有改变hash值就不变，这样css和js缓存就会分开判断要不要重新请求资源）
      --> 让代码上线运行缓存更好使用
*/

/** 复用loader */
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: ["postcss-preset-env"],
      },
    },
  },
];

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/build.[contenthash:10].js",
    path: resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          fix: true,
        },
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [...commonCssLoader],
          },
          {
            test: /\.less$/,
            use: [...commonCssLoader, "less-loader"],
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: { version: 3 },
                    targets: {
                      chrome: "60",
                      firefox: "60",
                      ie: "9",
                      safari: "10",
                      edge: "17",
                    },
                  },
                ],
              ],
              /** 开启babel缓存 */
              /** 第二次构建时，会读取之前的缓存 */
              cacheDirectory: true,
            },
          },
          {
            test: /\.(jpg|png|gif)$/,
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
              name: "[hash:10].[ext]",
              esModule: false,
              outputPath: "imgs",
            },
          },
          {
            test: /\.html$/,
            loader: "html-loader",
            options: {
              esModule: false,
            },
          },
          {
            exclude: /\.(html|js|css|less|jpg|png|gif)$/,
            loader: "file-loader",
            options: {
              outputPath: "media",
              name: "[hash:10].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "css/build.[contenthash:10].css",
    }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  mode: "production",
  devtool: "source-map",
};
