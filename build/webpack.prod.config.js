const prodConfig = {
  mode: "production",
  externals: {
    antd: "antd",
    react: "React",
    "react-dom": "ReactDOM",
    moment: "moment",
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "all",
    },
  },
};
module.exports = prodConfig;
