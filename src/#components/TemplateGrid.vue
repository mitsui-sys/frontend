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
    </v-app-bar>
    <!--<v-tabs v-model="tab" align-with-title>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card flat>
          <v-card-text v-text="text"></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>-->
    <!-- メイン -->
    <v-main>
      <Sheet />
    </v-main>
    <Tab />

    <!-- フッター -->
    <v-footer app color="primary"> </v-footer>
  </v-app>
</template>

<script>
import Tab from "./Tab";
import Property from "./Property";
import Sheet from "./Sheet";

export default {
  name: "Grid",
  components: { Tab, Property, Sheet },
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
