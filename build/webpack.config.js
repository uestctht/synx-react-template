const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const devConfig = require("./webpack.dev.config");
const prodConfig = require("./webpack.prod.config");
const { merge } = require("webpack-merge");
const baseConfig = {
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.jsx$/],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: [/\.less$/, /\.css$/],
        exclude: [/node_modules/],
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
              },
            },
          },
          "less-loader",
        ],
      },
      // {
      //   test: [/\.css$/],
      //   exclude: [/src/],
      //   use: ["style-loader", "css-loader"],
      // },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("file-loader"),
            options: {
              outputPath: "images/",
              name: "[name]_[hash].[ext]",
            },
          },
          // {
          //   loader: "image-webpack-loader",
          //   options: {
          //     mozjpeg: {
          //       progressive: true,
          //     },
          //     // optipng.enabled: false will disable optipng
          //     optipng: {
          //       enabled: false,
          //     },
          //     pngquant: {
          //       quality: [0.65, 0.9],
          //       speed: 4,
          //     },
          //     // gifsicle: {
          //     //   interlaced: false,
          //     // },
          //     // the webp option will enable WEBP
          //     webp: {
          //       quality: 75,
          //     },
          //   },
          // },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CleanWebpackPlugin(),
  ],
};
module.exports = (env) => {
  if (env && env === "production") {
    return merge(baseConfig, prodConfig);
  } else {
    return merge(baseConfig, devConfig);
  }
};
