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
      component: loadView("Sheet"),
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
      path: "/login",
      name: "login",
      component: loadView("Login"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/signup",
      name: "signup",
      component: loadView("SignUp"),
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
      path: "/fileregister",
      name: "fileregister",
      component: loadView("FileRegister"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/detail",
      name: "detail",
      component: loadView("DetailPage"),
    },
    {
      path: "/drag",
      name: "drag",
      component: loadView("DragTest"),
    },
    {
      path: "/error",
      name: "error",
      component: loadView("Login"),
    },
    {
      path: "*",
      redirect: "/error",
    },
  ],
});

// router gards
router.beforeEach((to, from, next) => {
  // NProgress.start()
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log("認証が必要あり");
    // トークンが存在、かつログイン有効期限を過ぎてない場合、またはログイン画面の場合
    const hasToken = store.state.auth.login.token;
    const hasExpire = store.state.auth.login.expire > new Date().getTime();
    const isLogin = to.matched.some((page) => {
      // ログイン画面はリダイレクト対象外 (他にも404ページなどいくつか対象外にする必要があるかも)
      return page.path === "/login";
    });
    console.log(hasToken, hasExpire, isLogin);
    if ((hasToken && hasExpire) || isLogin) {
      next();
    } else {
      console.log("ログインしていません");
      next({ path: "/login", query: { backuri: to.fullPath } });
    }
  } else {
    // ログイン画面に飛ばす。ログイン後に元の画面に戻れるよう、backuriパラメーターにリダイレクト前のURLを入れる
    //next({path: '/login', query: {redirect: to.fullPath, message: true}})
    console.log("認証が必要なし");
    next();
  }
});

// router.afterEach((to, from) => {
//   console.log(to, from)
//   NProgress.done()
// })

export default router;