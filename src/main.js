import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router"; //追加
import axios from "axios"; //追記
import VueAxios from "vue-axios"; //追記
import store from "./store";

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

/**
 * 文字数を制限して余分があれば省略して末尾...に置換する
 * @param {String} text
 * @param {Number} length
 * @param {String} clamp
 * @returns {String}
 */
Vue.filter("truncate", (text, length, clamp) => {
  text = text || "";
  clamp = clamp || "...";
  length = length || 30;

  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + clamp;
});

new Vue({
  router, //追加
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
