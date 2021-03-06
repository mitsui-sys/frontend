<template>
  <v-app>
    <!-- サイドメニュー -->
    <v-navigation-drawer
      clipped
      v-model="drawer"
      v-if="development && loginData.level >= 1"
      app
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
      <v-toolbar-title :class="`text-${bkPoint.titleModel}`" class="mainTitle"
        >台帳システム</v-toolbar-title
      >
      <!--
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
      -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
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
          :class="`text-${bkPoint.btnSize}`"
          @click="openPDF"
          v-if="showPDF && loginData.token"
          >{{ btn_title.help }}<v-icon>mdi-help</v-icon></v-btn
        >
        <v-btn
          text
          to="/osm"
          :class="`text-${bkPoint.btnSize}`"
          v-if="loginData.level >= 1"
          >{{ btn_title.map }}</v-btn
        >
      </v-toolbar-items>
    </v-app-bar>
    <!-- メイン -->

    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- vue-routerを使用する場合 -->

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
import http from "@/modules/http";
import saveAs from "file-saver";

export default {
  name: "App",
  data() {
    return {
      development: false,
      showPDF: true,
      width: 800,
      height: 600,
      default: { width: 800, height: 600 },
      isLogin: false,
      loading: true,
      btn_title: {
        home: "ホーム",
        setting: "設定",
        login: "ログイン",
        support: "サポート",
        help: "ヘルプ",
        map: "地図",
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
    // development() {
    //   return this.$store.getters[`config/development`];
    // },
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
        btnWidth: 600,
        btnHeight: 150,
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
        case "sm":
        case "xs":
          point.minHeight = 200;
          point.titleModel = "h4";
          point.btnSize = "h6";
          point.btnWidth = 275;
          point.btnHeight = 40;
          break;
        default:
          break;
      }
      return point;
    },
    replaceData() {
      return this.$store.getters[`table/replace`];
    },
    displayData() {
      return this.$store.getters[`table/display`];
    },
  },
  methods: {
    openPDF() {
      const path = "/resources/manual.pdf";
      let isDownload = false;
      if (isDownload) {
        saveAs(path, "manual.pdf");
      } else {
        window.open(path);
      }
    },
    handleResize() {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      const width = window.innerWidth;
      const height = window.innerHeight;
      const d_width = this.default.width;
      const d_height = this.default.height;

      if (width < d_width) {
        console.log("幅が小さい");
        window.resizeTo(d_width, height);
        window.innerWidth = d_width;
      }
      if (height < d_height) {
        console.log("高さが小さい");
        window.resizeTo(width, d_height);
      }
      console.log("WindowSize", width, height);
    },
    logout() {
      console.log(this.token);
      this.$store.dispatch(`auth/destroy`);
      // already logined
      this.$router.push("/login", () => {});
    },
    async getReplace() {
      const url = "/system/replace";
      const res = await http.getReplace(url);
      if (res.status == 200) {
        const data = res.data;
        this.$store.dispatch(`table/updateReplace`, data);
        console.log("Replace", this.replaceData);
      } else {
        console.error(res);
      }
    },
    async getDisplay() {
      const url = "/display";
      const res = await http.get(url);
      if (res.status == 200) {
        const data = res.data;
        this.$store.dispatch(`table/updateDisplay`, data);
        console.log("Display", this.displayData);
      } else {
        console.error(res);
      }
    },
  },
  beforeCreate() {
    // リアクティブデータ作成前に行いたい処理
  },
  async created() {
    await this.getReplace();
    await this.getDisplay();
    console.log(this.replaceData, this.displayData);
  },
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 500);

    // window.addEventListener("resize", this.handleResize);
  },
  // beforeDestroy: function () {
  //   window.removeEventListener("resize", this.handleResize);
  // },
};
</script>

<style>
/* サイト全体のフォント指定 */
* {
  /*font-family: "MSゴシック", sans-serif !important;*/
  font-family: "MSゴシック" !important;
  /*
  font-family: monospace !important;
  font-family: sans-serif !important;
  font-family: serif !important;
  */
}
.main-title {
  font-size: 28px !important;
}

.v-data-table {
  white-space: nowrap;
}
.v-data-table th {
  border: 1px #333333 solid;
  background: #fdfcaa !important;
  font-size: 20px !important;
}
.display.v-data-table td {
  background: #dddddd;
  border: 1px solid;
  font-size: 20px !important;
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

.displaybutton {
  font-size: 20px !important;
}

/* ヘッダに縦線出すよ */
.resizable-column /deep/ th + th {
  border-left: 1px solid grey;
}

/* ヘッダに縦線出すよ */
.resizable-column /deep/ th + th {
  border-left: 1px solid grey;
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
.showdialog {
  max-height: 500px;
}
.item-header {
  font-size: 20px !important;
  min-width: 150px;
}
</style>
