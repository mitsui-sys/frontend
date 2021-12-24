<template>
  <v-app>
    <!-- サイドメニュー -->
    <v-navigation-drawer app clipped v-model="drawer">
      <Property />
    </v-navigation-drawer>

    <!-- ヘッダー -->
    <v-app-bar app clippedLeft flat dark color="indigo darken-3">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>台帳システム</v-toolbar-title>
      <router-link to="/" class="link">Home</router-link>
      <router-link to="/main" class="link">Main</router-link>
    </v-app-bar>
    <!-- メイン -->
    <v-main>
      <!-- 名前なしと名前付きのrouter-viewを配置します。 -->
      <router-view class="title" />
      <router-view name="content1" class="content" />
      <router-view name="content2" class="content" />
    </v-main>

    <!-- フッター -->
    <v-footer app color="primary"> </v-footer>
  </v-app>
</template>

<template>
  <div id="app" class="gridLayout">
    <router-link to="/" class="link">Home</router-link>
    <router-link to="/main" class="link">Main</router-link>

    <!-- 名前なしと名前付きのrouter-viewを配置します。 -->
    <router-view class="title" />
    <router-view name="content1" class="content" />
    <router-view name="content2" class="content" />
  </div>
</template>

<script>
// import Tab from "./components/Tab";
import Property from "./components/Property";

export default {
  name: "App",

  components: {
    Property,
  },
  data() {
    return {
      drawer: false,
      tab: null,
      items: ["web", "shopping", "videos", "images", "news"],
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    };
  },
  methods: {},
};
</script>

<style>
* {
  font-size: 24px !important;
}
</style>
