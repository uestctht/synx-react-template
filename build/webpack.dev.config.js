const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HOST = "http://222.197.167.67";
const devConfig = {
  mode: "development",
  devtool: "cheap-module-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin(),
  ],
  devServer: {
    contentBase: "./dist",
    open: true,
    hot: true,
    hotOnly: true,
    port: "8080",
    proxy: {
      "/user": {
        target: `${HOST}/user`,
        changeOrigin: true,
        pathRewrite: {
          "^/user": "/",
        },
      },
      "/catraApi": {
        target: `${HOST}/catraApi`,
        changeOrigin: true,
        pathRewrite: {
          "^/catraApi": "/",
        },
      },
      "/coop": {
        target: `${HOST}/coop`,
        changeOrigin: true,
        pathRewrite: {
          "^/coop": "/",
        },
      },
    },
  },
};
module.exports = devConfig;
