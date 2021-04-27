const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

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
            use: [
              /* 
                thread-loader会对其后面的loader（这里是babel-loader）开启多进程打包。 
                进程启动大概为600ms，进程通信也有开销。(启动的开销比较昂贵，不要滥用)
                只有工作消耗时间比较长，才需要多进程打包
              */
              {
                loader: "thread-loader",
                options: {
                  workers: 2, // 进程2个
                },
              },
              {
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
                  cacheDirectory: true,
                },
              },
            ],
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
    new WorkboxWebpackPlugin.GenerateSW({
      /*
        1. 帮助serviceworker快速启动
        2. 删除旧的 serviceworker

        生成一个 serviceworker 配置文件
      */
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  mode: "production",
  devtool: "source-map",
};
