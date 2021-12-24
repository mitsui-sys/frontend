<template>
  <v-app>
    <!-- サイドメニュー -->
    <v-navigation-drawer app clipped v-model="drawer" v-if="isDevelopment">
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
        v-if="isDevelopment"
      ></v-app-bar-nav-icon>
      <v-toolbar-title fi>台帳システム</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text to="/">{{ btn_title.home }}</v-btn>
        <v-btn text to="/setting" v-if="isDevelopment">{{
          btn_title.setting
        }}</v-btn>
        <v-btn text to="/login" v-if="isDevelopment">{{
          btn_title.login
        }}</v-btn>
        <v-menu offset-y v-if="isDevelopment">
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
      </v-toolbar-items>
    </v-app-bar>
    <!-- メイン -->
    <v-main>
      <!-- 名前なしと名前付きのrouter-viewを配置します。 -->
      <router-view class="title" />
      <router-view name="content1" class="content" />
      <router-view name="content2" class="content" />
    </v-main>

    <!-- フッター -->
    <v-footer app color="primary" dark align="right">
      <v-spacer></v-spacer>
      <img
        src="/resources/kanko.svg"
        alt="かんこうロゴ"
        title="かんこうロゴ"
        width="100"
        @click="clickLogo"
    /></v-footer>
  </v-app>
</template>

<script>
// import { config } from "@/const/const";
export default {
  name: "Main",
  data() {
    return {
      isDevelopment: false,
      btn_title: {
        home: "ホーム",
        setting: "設定",
        login: "ログイン",
        support: "サポート",
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
  computed: {},
  methods: {
    clickLogo() {
      this.isDevelopment = !this.isDevelopment;
      console.log(`display development: ${this.isDevelopment}`);
    },
  },
  mounted() {},
};
</script>
