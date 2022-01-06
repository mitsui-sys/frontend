import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router"; //追加
import axios from "axios"; //追記
import VueAxios from "vue-axios"; //追記
import store from "./store";
// import log4js from "log4js";

// log4js.configure({
//   appenders: {
//     system: { type: "file", filename: "./logs/system.log" },
//   },
//   categories: {
//     default: { appenders: ["system"], level: "debug" },
//   },
// });
// let logger = log4js.getLogger();
// logger.level = "debug";
// logger.debug("debug msg");
// logger.trace("trace msg");
// logger.debug("debug msg");
// logger.info("info msg");
// logger.warn("warn msg");
// logger.error("error msg");
// logger.fatal("fatal msg");

Vue.use(VueAxios, axios); //追記import store from './store'

Vue.config.productionTip = false;

new Vue({
  router, //追加
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
