const path = require("path");

module.exports = {
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
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
    });

    // Return the altered config
    return config;
  },
  stories: ["../src/**/*.stories.js", "../stories/*.stories.js"],
};
