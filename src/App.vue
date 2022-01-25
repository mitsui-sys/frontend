<template>
  <v-app>
    <!-- サイドメニュー -->
    <v-navigation-drawer
      app
      clipped
      v-model="drawer"
      v-if="development && loginData.level >= 1"
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
        v-if="development"
      ></v-app-bar-nav-icon>
      <v-toolbar-title :class="`text-${bkPoint.titleModel}`"
        >台帳システム</v-toolbar-title
      >
      <v-btn
        v-if="development"
        @click="$router.go(-1)"
        :class="`text-${bkPoint.btnSize}`"
        >戻る<v-icon>mdi-arrow-left-bold-circle-outline</v-icon></v-btn
      >
      <v-btn
        v-if="development"
        @click="$router.go(1)"
        :class="`text-${bkPoint.btnSize}`"
        >進む<v-icon>mdi-arrow-right-bold-circle-outline</v-icon></v-btn
      >
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!$vuetify.breakpoint.xs">
        <v-btn text to="/" :class="`text-${bkPoint.btnSize}`">{{
          btn_title.home
        }}</v-btn>
        <v-btn
          text
          to="/login"
          v-if="!loginData.token"
          :class="`text-${bkPoint.btnSize}`"
          >{{ btn_title.login }}</v-btn
        >
        <v-menu
          bottom
          offset-y
          v-if="loginData.token"
          :class="`text-${bkPoint.btnSize}`"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" :class="`text-${bkPoint.btnSize}`"
              >{{ loginData.name }}<v-icon>mdi-account</v-icon></v-btn
            >
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title :class="`text-${bkPoint.btnSize}`">{{
                  loginLevel
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item to="/setting" v-if="loginData.level >= 2">
              <v-list-item-content>
                <v-list-item-title
                  class="primary--text"
                  :class="`text-${bkPoint.btnSize}`"
                  >設定</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout">
              <v-list-item-content>
                <v-list-item-title
                  class="primary--text"
                  :class="`text-${bkPoint.btnSize}`"
                  >ログアウト</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          offset-y
          v-if="development && loginData.level >= 1"
          :class="`text-${bkPoint.btnSize}`"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text :class="`text-${bkPoint.btnSize}`"
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
        <v-btn
          text
          v-if="development"
          to="/help"
          :class="`text-${bkPoint.btnSize}`"
          >{{ btn_title.help }}<v-icon>mdi-help</v-icon></v-btn
        >
      </v-toolbar-items>
    </v-app-bar>
    <!-- メイン -->
    <v-main>
      <!-- vue-routerを使用する場合 -->
      <router-view></router-view>
    </v-main>
    <!-- フッター -->
    <v-footer app color="primary">
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
    development() {
      return this.$store.getters[`config/development`];
    },
    loginLevel() {
      const level = this.loginData.level;
      return level == 0
        ? "閲覧者"
        : level == 1
        ? "編集者"
        : level == 2
        ? "管理者"
        : "閲覧者";
    },
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        minHeight: 200,
        titleModel: "h4",
        btnSize: "h6",
        btnWidth: 350,
        btnHeight: 50,
      };
      switch (bkPt.name) {
        case "xl":
          point.minHeight = 200;
          point.titleModel = "h4";
          point.btnSize = "h6";
          point.btnWidth = 600;
          point.btnHeight = 150;
          break;
        case "lg":
          point.minHeight = 200;
          point.titleModel = "h4";
          point.btnSize = "h6";
          point.btnWidth = 500;
          point.btnHeight = 100;
          break;
        case "md":
          point.minHeight = 200;
          point.titleModel = "h4";
          point.btnSize = "h6";
          point.btnWidth = 325;
          point.btnHeight = 50;
          break;
        case "sm":
          point.minHeight = 200;
          point.titleModel = "h4";
          point.btnSize = "h6";
          point.btnWidth = 275;
          point.btnHeight = 40;
          break;
        case "xs":
          point.minHeight = 200;
          point.titleModel = "h4";
          point.btnSize = "h6";
          point.btnWidth = 250;
          point.btnHeight = 30;
          break;
        default:
          break;
      }
      return point;
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
  },
};
//  font-size: 20px !important;
</script>

<style>
/* サイト全体のフォント指定 */
* {
  font-family: "MS Pゴシック";
}

.v-data-table {
  white-space: nowrap;
  font-size: 24px !important;
}
.v-data-table th {
  border: 1px #333333 solid;
  width: 100px !important;
}

.display.v-data-table tr th {
  background: #fdfcaa !important;
}
.display.v-data-table tr.v-data-table__selected td {
  background: #aadaff;
}

.display.v-data-table tr:hover td {
  background: #aafcff;
}

.v-data-table tr:nth-child(odd) td {
  background: #ffffff;
}
.display.v-data-table td {
  background: #dddddd;
  border: 1px solid;
}

/* ヘッダに縦線出すよ */
.resizable-column /deep/ th + th {
  border-left: 1px solid grey;
}

/* ヘッダに縦線出すよ */
.resizable-column /deep/ th + th {
  border-left: 1px solid grey;
}
.userlog.v-data-table th {
  background: #55cc55 !important;
  border: 1px solid;
}
.userlog.v-data-table tr.v-data-table__selected td {
  background: #aadaff;
}

.userlog.v-data-table tr:hover td {
  background: #aafcff;
}

.userdata.v-data-table th {
  background: #cccc55 !important;
  border: 1px solid;
}
.userdata.v-data-table tr.v-data-table__selected td {
  background: #aadaff;
}

.userdata.v-data-table tr:hover td {
  background: #aafcff;
}

.document.v-data-table th {
  background: #55cc55 !important;
  border: 1px solid;
}
.document.v-data-table tr.v-data-table__selected td {
  background: #aadaff;
}

.document.v-data-table tr:hover td {
  background: #aafcff;
}

.document.v-data-table td {
  background: #dddddd;
  border: 1px solid;
}

.drop_area {
  color: gray;
  font-weight: bold;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 300px;
  border: 5px solid gray;
  border-radius: 15px;
}
.enter {
  border: 10px dotted powderblue;
}
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.flex {
  display: flex;
  align-items: center;
  margin: 0;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5em;
  font-size: 10px;
}
</style>
