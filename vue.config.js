module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.example.app",
        win: {
          target: "portable",
          icon: "src/assets/icon.png"
        },
        mac: {
          target: "dmg",
          icon: "src/assets/icon.png"
        },
        extraResources: [
          {
            from: "./resources/config",
            to: "config/",
            filter: ["**/*"]
          }
        ]
      },
    }
  },
  devServer: {
    port:50000,
    proxy: {
        '/api/': {
            target: 'http://localhost:50001'
        }
    },
    disableHostCheck: true
  },
  transpileDependencies: [
    'vuetify'
  ],
}
