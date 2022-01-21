// const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devServer: {
    port: 50000,
    proxy: {
      "/api/": {
        target: "http://harima-isk:50001",
      },
    },
    disableHostCheck: true,
  },
  // configureWebpack: {
  //   plugins: [
  //     new CopyWebpackPlugin([
  //       {
  //         from: "node_modules/cesium/Build/Cesium/Workers",
  //         to: "Workers",
  //       },
  //     ]),
  //     new CopyWebpackPlugin([
  //       {
  //         from: "node_modules/cesium/Build/Cesium/ThirdParty",
  //         to: "ThirdParty",
  //       },
  //     ]),
  //     new CopyWebpackPlugin([
  //       {
  //         from: "node_modules/cesium/Build/Cesium/Assets",
  //         to: "Assets",
  //       },
  //     ]),
  //     new CopyWebpackPlugin([
  //       {
  //         from: "node_modules/cesium/Build/Cesium/Widgets",
  //         to: "Widgets",
  //       },
  //     ]),
  //   ],
  // },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.example.app",
        win: {
          target: "portable",
          icon: "src/assets/icon.png",
        },
        mac: {
          target: "dmg",
          icon: "src/assets/icon.png",
        },
        extraResources: [
          {
            from: "./resources/config",
            to: "config/",
            filter: ["**/*"],
          },
        ],
      },
    },
  },

  transpileDependencies: ["vuetify"],
};
