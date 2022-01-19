import Vue from "vue";
import Router from "vue-router";

import "nprogress/nprogress.css";
// import NProgress from "nprogress"
import store from "./store.js";

Vue.use(Router);

function loadView(view) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`);
}

const router = new Router({
  mode: "history",
  // base:process.env.BASE_URL,
  // linkActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "home",
      // この場合、App.vueで配置した名前なしのrouter-viewのみ切り替わります。
      component: loadView("Home"),
      children: [],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/sheet",
      name: "sheet",
      // この場合、App.vueで配置した名前なしのrouter-viewのみ切り替わります。
      component: loadView("Sheet"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: loadView("Login"),
    },

    {
      path: "/pdf",
      name: "pdf",
      // この場合、App.vueで配置した名前なしのrouter-viewのみ切り替わります。
      component: loadView("SamplePDF"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/about",
      name: "about",
      component: loadView("About"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/signup",
      name: "signup",
      component: loadView("SignUp"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/setting",
      name: "setting",
      component: loadView("Setting"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/ipsetting",
      name: "ipsetting",
      component: loadView("IPSetting"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/leaflet",
      name: "leaflet",
      component: loadView("MyLeaflet"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/osm",
      name: "osm",
      component: loadView("About"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/cesium",
      name: "cesium",
      component: loadView("Cesium"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/fileregister",
      name: "fileregister",
      component: loadView("FileRegister"),
    },
    {
      path: "/detail",
      name: "detail",
      component: loadView("DetailPage"),
    },
    // {
    //   path: "/page",
    //   name: "page",
    //   component: loadView("DetailPage"),
    // },
    {
      path: "/document",
      name: "document",
      component: loadView("Document"),
    },
    {
      path: "/drag",
      name: "drag",
      component: loadView("DragTest"),
    },
    {
      path: "/chohyo",
      name: "chohyo",
      component: loadView("Chohyo"),
    },
    {
      path: "/error",
      name: "error",
      component: loadView("Error"),
    },
    {
      path: "*",
      redirect: "/error",
    },
  ],
});

// router gards
router.beforeEach((to, from, next) => {
  console.log(to);
  // NProgress.start()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // console.log("認証必要あり");
    // トークンが存在、かつログイン有効期限を過ぎてない場合、またはログイン画面の場合
    const hasToken = store.state.auth.login.token;
    const hasExpire = store.state.auth.login.expire > new Date().getTime();
    //ログイン情報の確認
    if (hasToken && hasExpire) {
      next();
    } else {
      console.log("ログインしていません");
      next({ path: "/login", query: { backuri: to.fullPath } });
    }
  } else {
    // ログイン画面に飛ばす。ログイン後に元の画面に戻れるよう、backuriパラメーターにリダイレクト前のURLを入れる
    //next({path: '/login', query: {redirect: to.fullPath, message: true}})
    console.log("ログイン必要なし");
    next();
  }
});

// router.afterEach((to, from) => {
//   console.log(to, from)
//   NProgress.done()
// })
// script window.open に解決されたurlを渡す

export default router;
