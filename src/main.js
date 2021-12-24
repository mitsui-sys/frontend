import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router"; //追加
import axios from "axios"; //追記
import VueAxios from "vue-axios"; //追記
import store from "./store";

Vue.use(VueAxios, axios); //追記import store from './store'

Vue.config.productionTip = false;

new Vue({
  router, //追加
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
