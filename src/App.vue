<template>
  <v-app>
    <!-- サイドメニュー -->
    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
      v-if="isDevelopment && loginData.level >= 1"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title grey--text text--darken-2">
                  {{ NAV_TITLE }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>

            <v-list nav dense>
              <v-list-group
                v-for="nav_list in NAV_LISTS"
                :key="nav_list.name"
                :prepend-icon="nav_list.icon"
                no-action
                :append-icon="nav_list.lists ? undefined : ''"
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ nav_list.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item
                  v-for="list in nav_list.lists"
                  :key="list.name"
                  :to="list.link"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ list.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>

    <!-- ヘッダー -->
    <v-app-bar app clippedLeft flat dark color="indigo darken-3">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="isDevelopment && loginData.level >= 1"
      ></v-app-bar-nav-icon>
      <v-toolbar-title fi>台帳システム</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text to="/">{{ btn_title.home }}</v-btn>
        <v-btn text to="/login" v-if="!loginData.token">{{
          btn_title.login
        }}</v-btn>
        <v-menu bottom offset-y v-if="loginData.token">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on"
              >{{ loginData.name }}<v-icon>mdi-account</v-icon></v-btn
            >
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ loginData.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item to="/setting" v-if="loginData.level >= 2">
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >設定</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout">
              <v-list-item-content>
                <v-list-item-title class="primary--text"
                  >ログアウト</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          offset-y
          v-show="isDevelopment"
          v-if="isDevelopment && loginData.level >= 1"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text
              >{{ btn_title.support }}<v-icon>mdi-menu-down</v-icon></v-btn
            >
          </template>
          <v-list>
            <v-subheader>Get help</v-subheader>
            <v-list-item
              v-for="support in supports"
              :key="support.name"
              :to="support.link"
            >
              <v-list-item-icon>
                <v-icon>{{ support.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ support.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn text to="/help"
          >{{ btn_title.help }}<v-icon>mdi-help</v-icon></v-btn
        >
      </v-toolbar-items>
    </v-app-bar>
    <!-- メイン -->
    <v-main>
      <v-container fluid>
        <!-- vue-routerを使用する場合 -->
        <router-view></router-view>
      </v-container>
    </v-main>
    <!-- フッター -->
    <v-footer app color="primary" dark align="right">
      <v-spacer></v-spacer>
      <img
        src="/resources/kanko.svg"
        alt="かんこうロゴ"
        title="かんこうロゴ"
        width="100"
    /></v-footer>
  </v-app>
</template>

<script>
// import Loading from "./components/Loading";
import Main from "@/views/Main.vue";

export default {
  name: "App",
  component: {
    Main,
  },
  data() {
    return {
      isLogin: false,
      isDevelopment: true,
      loading: true,
      btn_title: {
        home: "ホーム",
        setting: "設定",
        login: "ログイン",
        support: "サポート",
        help: "ヘルプ",
      },
      drawer: false,
      supports: [
        {
          name: "Consulting and suppourt",
          icon: "mdi-vuetify",
          link: "/consulting-and-support",
        },
        {
          name: "Discord community",
          icon: "mdi-discord",
          link: "/discord-community",
        },
        {
          name: "Report a bug",
          icon: "mdi-bug",
          link: "/report-a-bug",
        },
        {
          name: "Github issue board",
          icon: "mdi-github-face",
          link: "/guthub-issue-board",
        },
        {
          name: "Stack overview",
          icon: "mdi-stack-overflow",
          link: "/stack-overview",
        },
      ],
      NAV_TITLE: "操作一覧",
      NAV_LISTS: [
        {
          name: "サンプル",
          icon: "mdi-speedometer",
          lists: [
            {
              name: "テーブル操作（vue.jsのみ）",
              link: "/quick-start",
            },
            {
              name: "Leaflet",
              link: "/leaflet",
            },
            {
              name: "OpenLayers",
              link: "/osm",
            },
            {
              name: "Cesium",
              link: "/cesium",
            },
          ],
        },
        {
          name: "設定",
          icon: "mdi-cogs",
        },
        {
          name: "スタイル",
          icon: "mdi-palette",
          lists: [
            { name: "色", link: "/colors" },
            { name: "内容", link: "/content" },
            { name: "表示", link: "/display" },
          ],
        },
        {
          name: "UI コンポーネント",
          icon: "mdi-view-dashboard",
          lists: [
            { name: "Sample", link: "/ui_sample" },
            { name: "API explorer", link: "/register" },
            { name: "Alerts", link: "alerts" },
          ],
        },
        {
          name: "Directives",
          icon: "mdi-function",
        },
        {
          name: "Preminum themes",
          icon: "mdi-vuetify",
        },
      ],
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
  },
  methods: {
    logout() {
      console.log(this.token);
      this.$store.dispatch(`auth/destroy`);
      // already logined
      this.$router.push("/login", () => {});
    },
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);
    console.log(this.$route);
  },
};
</script>

<style>
/* ヘッダに縦線出すよ */
.resizable-column /deep/ th + th {
  border-left: 1px solid grey;
}

* {
  font-size: 24px !important;
}
.display.v-data-table {
  white-space: nowrap;
}
.display.v-data-table th {
  border: 1px #333333 solid;
  background: #55cccc !important;
  font-size: 24px !important;
  white-space: nowrap;
  width: 100px !important;
}

.display.v-data-table td {
  background: #dddddd;
  border: 1px solid;
  font-size: 24px !important;
}

.display.v-data-table tr:nth-child(odd) td {
  background: #fff;
  font-size: 24px !important;
}
/* ヘッダに縦線出すよ */
.resizable-column /deep/ th + th {
  border-left: 1px solid grey;
}

* {
  font-size: 24px !important;
}

.userinfo.v-data-table {
  white-space: nowrap;
}
.userlog.v-data-table {
  white-space: nowrap;
}
.userdata.v-data-table {
  white-space: nowrap;
}
.userinfo.v-data-table th {
  border: 1px #333333 solid;
  background: #55cccc !important;
  font-size: 24px !important;
  white-space: nowrap;
  width: 100px !important;
}
.userlog.v-data-table th {
  border: 1px #333333 solid;
  background: #55cc55 !important;
  font-size: 24px !important;
  white-space: nowrap;
  width: 100px !important;
}
.userdata.v-data-table th {
  border: 1px #333333 solid;
  background: #cccc55 !important;
  font-size: 24px !important;
  white-space: nowrap;
  width: 100px !important;
}

.v-data-table td {
  background: #dddddd;
  border: 1px solid;
  font-size: 24px !important;
}

.v-data-table tr:nth-child(odd) td {
  background: #fff;
  font-size: 24px !important;
}
</style>
